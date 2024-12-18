import java.util.concurrent.*;
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import java.util.concurrent.locks.ReentrantLock;
import java.time.LocalDateTime;
import java.time.Duration;

@RestController
@RequestMapping("/api/parking")
public class ParkingSpotManager {
    private final Map<String, ParkingSpot> parkingSpots = new ConcurrentHashMap<>();
    private final Map<String, ParkingRecord> parkingRecords = new ConcurrentHashMap<>();
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    private final ReentrantLock reservationLock = new ReentrantLock();
    private static final double HOURLY_RATE = 100.0; // ₹100 per hour

    public ParkingSpotManager() {
        // Initialize parking spots
        for (int i = 1; i <= 100; i++) {
            String spotId = String.format("SPOT_%03d", i);
            parkingSpots.put(spotId, new ParkingSpot(spotId));
        }
        startMonitoringThread();
    }

    @PostMapping("/entry")
    public ResponseEntity<ParkingResponse> createEntry(@RequestBody ParkingEntry entry) {
        try {
            reservationLock.lock();
            ParkingSpot spot = parkingSpots.get(entry.getSpotNumber());
            
            if (spot == null || !spot.isAvailable()) {
                return ResponseEntity.badRequest().body(new ParkingResponse("Spot not available"));
            }

            String recordId = generateRecordId();
            ParkingRecord record = new ParkingRecord(
                recordId,
                entry.getName(),
                entry.getEmail(),
                entry.getPhone(),
                entry.getNumberPlate(),
                entry.getSpotNumber(),
                entry.getCheckInTime(),
                entry.getCheckOutTime()
            );

            parkingRecords.put(recordId, record);
            spot.occupy(recordId);

            return ResponseEntity.ok(new ParkingResponse("Entry created successfully", recordId));
        } finally {
            reservationLock.unlock();
        }
    }

    @GetMapping("/calculate-bill/{recordId}")
    public ResponseEntity<BillingResponse> calculateBill(@PathVariable String recordId) {
        ParkingRecord record = parkingRecords.get(recordId);
        if (record == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDateTime checkIn = record.getCheckInTime();
        LocalDateTime checkOut = record.getCheckOutTime();
        
        Duration duration = Duration.between(checkIn, checkOut);
        long hours = duration.toHours();
        if (duration.toMinutes() % 60 > 0) {
            hours++; // Round up to next hour
        }

        double amount = hours * HOURLY_RATE;
        return ResponseEntity.ok(new BillingResponse(amount, hours));
    }

    @GetMapping("/daily-revenue/{date}")
    public ResponseEntity<RevenueResponse> getDailyRevenue(@PathVariable String date) {
        double totalRevenue = parkingRecords.values().stream()
            .filter(record -> record.getCheckInTime().toLocalDate().toString().equals(date))
            .mapToDouble(this::calculateRevenue)
            .sum();

        return ResponseEntity.ok(new RevenueResponse(totalRevenue, date));
    }

    private double calculateRevenue(ParkingRecord record) {
        Duration duration = Duration.between(record.getCheckInTime(), record.getCheckOutTime());
        long hours = duration.toHours();
        if (duration.toMinutes() % 60 > 0) hours++;
        return hours * HOURLY_RATE;
    }

    @Data
    static class ParkingSpot {
        private final String id;
        private volatile boolean available = true;
        private volatile String currentRecordId;

        public void occupy(String recordId) {
            this.currentRecordId = recordId;
            this.available = false;
        }

        public void release() {
            this.currentRecordId = null;
            this.available = true;
        }
    }

    @Data
    static class ParkingEntry {
        private String name;
        private String email;
        private String phone;
        private String numberPlate;
        private String spotNumber;
        private LocalDateTime checkInTime;
        private LocalDateTime checkOutTime;
    }

    @Data
    static class ParkingRecord {
        private final String id;
        private final String name;
        private final String email;
        private final String phone;
        private final String numberPlate;
        private final String spotNumber;
        private final LocalDateTime checkInTime;
        private final LocalDateTime checkOutTime;
    }

    @Data
    static class ParkingResponse {
        private final String message;
        private final String recordId;

        public ParkingResponse(String message) {
            this(message, null);
        }
    }

    @Data
    static class BillingResponse {
        private final double amount;
        private final long hours;
    }

    @Data
    static class RevenueResponse {
        private final double totalRevenue;
        private final String date;
    }
}