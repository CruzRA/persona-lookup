// Type definitions for the retail database

export interface Address {
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export interface PaymentMethodBase {
  source: "credit_card" | "paypal" | "gift_card";
  id: string;
}

export interface CreditCard extends PaymentMethodBase {
  source: "credit_card";
  brand: string;
  last_four: string;
}

export interface PayPal extends PaymentMethodBase {
  source: "paypal";
}

export interface GiftCard extends PaymentMethodBase {
  source: "gift_card";
  balance: number;
}

export type PaymentMethod = CreditCard | PayPal | GiftCard;

export interface User {
  user_id: string;
  name: {
    first_name: string;
    last_name: string;
  };
  address: Address;
  email: string;
  payment_methods: Record<string, PaymentMethod>;
  orders: string[];
}

export interface ProductVariant {
  item_id: string;
  options: Record<string, string>;
  available: boolean;
  price: number;
}

export interface Product {
  name: string;
  product_id: string;
  variants: Record<string, ProductVariant>;
}

export interface OrderItem {
  name: string;
  product_id: string;
  item_id: string;
  price: number;
  options: Record<string, string>;
}

export interface Fulfillment {
  tracking_id: string[];
  item_ids: string[];
}

export interface PaymentTransaction {
  transaction_type: "payment" | "refund";
  amount: number;
  payment_method_id: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  address: Address;
  items: OrderItem[];
  status: "pending" | "processed" | "delivered" | "cancelled";
  fulfillments: Fulfillment[];
  payment_history: PaymentTransaction[];
}

export interface RetailDatabase {
  products: Record<string, Product>;
  users: Record<string, User>;
  orders: Record<string, Order>;
}
