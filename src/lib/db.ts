import { readFileSync } from "fs";
import path from "path";
import { gunzipSync } from "zlib";
import type {
  AirlineDatabase,
  User,
  Reservation,
  Flight,
  FlightDateInfo,
} from "./types";

let db: AirlineDatabase | null = null;

function getDb(): AirlineDatabase {
  if (!db) {
    const filePath = path.join(process.cwd(), "src/data/airline_db.json.gz");
    const compressed = readFileSync(filePath);
    db = JSON.parse(gunzipSync(compressed).toString("utf-8")) as AirlineDatabase;
  }
  return db;
}

export function getAllUsers(): User[] {
  return Object.values(getDb().users);
}

export function getUserById(userId: string): User | undefined {
  return getDb().users[userId];
}

export function searchUsers(query: string): User[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return Object.values(getDb().users).filter((user) => {
    const fullName = `${user.name.first_name} ${user.name.last_name}`.toLowerCase();
    return (
      user.user_id.toLowerCase().includes(q) ||
      fullName.includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });
}

export function getReservationById(reservationId: string): Reservation | undefined {
  return getDb().reservations[reservationId];
}

export function getReservationsByUserId(userId: string): Reservation[] {
  const user = getDb().users[userId];
  if (!user) return [];

  return user.reservations
    .map((reservationId) => getDb().reservations[reservationId])
    .filter((reservation): reservation is Reservation => reservation !== undefined);
}

export function getFlightByNumber(flightNumber: string): Flight | undefined {
  return getDb().flights[flightNumber];
}

export function getFlightDateInfo(
  flightNumber: string,
  date: string
): FlightDateInfo | undefined {
  const flight = getDb().flights[flightNumber];
  if (!flight) return undefined;
  return flight.dates[date];
}

export function getStats() {
  const database = getDb();
  return {
    totalUsers: Object.keys(database.users).length,
    totalReservations: Object.keys(database.reservations).length,
    totalFlights: Object.keys(database.flights).length,
  };
}
