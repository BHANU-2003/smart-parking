import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('parking.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parking_spots (
    id TEXT PRIMARY KEY,
    is_occupied BOOLEAN DEFAULT FALSE,
    user_id INTEGER,
    vehicle_number TEXT,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS parking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spot_id TEXT,
    user_id INTEGER,
    vehicle_number TEXT,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Create admin account if it doesn't exist
const adminEmail = 'admin@123';
const adminPassword = 'admin@123';

const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare(`
    INSERT INTO users (username, email, password, is_admin)
    VALUES (?, ?, ?, ?)
  `).run('Admin', adminEmail, hashedPassword, true);
}

export const createUser = db.prepare(`
  INSERT INTO users (username, email, password, is_admin)
  VALUES (?, ?, ?, ?)
`);

export const findUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

export const validateUser = async (email: string, password: string) => {
  const user = findUserByEmail.get(email);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return user;
};

export const createParkingEntry = db.prepare(`
  INSERT INTO parking_spots (id, is_occupied, user_id, vehicle_number, check_in, check_out, amount)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

export const updateParkingSpot = db.prepare(`
  UPDATE parking_spots
  SET is_occupied = ?, user_id = ?, vehicle_number = ?, check_in = ?, check_out = ?, amount = ?
  WHERE id = ?
`);

export const deleteParkingEntry = db.prepare(`
  DELETE FROM parking_spots WHERE id = ?
`);

export const getParkingSpots = db.prepare(`
  SELECT * FROM parking_spots
`);

export const createParkingHistory = db.prepare(`
  INSERT INTO parking_history (spot_id, user_id, vehicle_number, check_in, check_out, amount)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const getDailyRevenue = db.prepare(`
  SELECT SUM(amount) as total
  FROM parking_history
  WHERE DATE(check_in) = DATE(?)
`);

export default db;