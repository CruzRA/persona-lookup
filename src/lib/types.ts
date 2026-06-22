// Type definitions for the airline database

export interface Address {
  address1: string;
  address2: string | null;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export interface PaymentMethodBase {
  source: "credit_card" | "gift_card" | "certificate";
  id: string;
}

export interface CreditCard extends PaymentMethodBase {
  source: "credit_card";
  brand: string;
  last_four: string;
}

export interface GiftCard extends PaymentMethodBase {
  source: "gift_card";
  amount: number;
}

export interface Certificate extends PaymentMethodBase {
  source: "certificate";
  amount: number;
}

export type PaymentMethod = CreditCard | GiftCard | Certificate;

export interface PersonName {
  first_name: string;
  last_name: string;
}

export interface Passenger extends PersonName {
  dob: string;
}

export type MembershipTier = "regular" | "silver" | "gold";

export interface User {
  user_id: string;
  name: PersonName;
  address: Address;
  email: string;
  dob: string;
  payment_methods: Record<string, PaymentMethod>;
  saved_passengers: Passenger[];
  membership: MembershipTier;
  reservations: string[];
}

export type FlightDateStatus =
  | "available"
  | "cancelled"
  | "delayed"
  | "flying"
  | "landed"
  | "on time";

export interface FlightDateInfo {
  status: FlightDateStatus;
  actual_departure_time_est?: string;
  actual_arrival_time_est?: string;
  estimated_departure_time_est?: string;
  estimated_arrival_time_est?: string;
  available_seats?: Record<string, number>;
  prices?: Record<string, number>;
}

export interface Flight {
  origin: string;
  destination: string;
  flight_number: string;
  scheduled_departure_time_est: string;
  scheduled_arrival_time_est: string;
  dates: Record<string, FlightDateInfo>;
}

export interface ReservationSegment {
  origin: string;
  destination: string;
  flight_number: string;
  date: string;
  price: number;
}

export interface ReservationPayment {
  payment_id: string;
  amount: number;
}

export type FlightType = "one_way" | "round_trip";
export type CabinClass = "basic_economy" | "economy" | "business";
export type InsuranceOption = "yes" | "no";

export interface Reservation {
  reservation_id: string;
  user_id: string;
  origin: string;
  destination: string;
  flight_type: FlightType;
  cabin: CabinClass;
  flights: ReservationSegment[];
  passengers: Passenger[];
  payment_history: ReservationPayment[];
  created_at: string;
  total_baggages: number;
  nonfree_baggages: number;
  insurance: InsuranceOption;
}

export interface AirlineDatabase {
  flights: Record<string, Flight>;
  users: Record<string, User>;
  reservations: Record<string, Reservation>;
}
