import type { RetailDatabase, User, Order, Product } from "./types";
import data from "../data/retail_db.json";

// Cast through unknown to handle JSON's inferred types
const db = data as unknown as RetailDatabase;

export function getAllUsers(): User[] {
  return Object.values(db.users);
}

export function getUserById(userId: string): User | undefined {
  return db.users[userId];
}

export function searchUsers(query: string): User[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return Object.values(db.users).filter((user) => {
    const fullName = `${user.name.first_name} ${user.name.last_name}`.toLowerCase();
    return (
      user.user_id.toLowerCase().includes(q) ||
      fullName.includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });
}

export function getOrderById(orderId: string): Order | undefined {
  return db.orders[orderId];
}

export function getOrdersByUserId(userId: string): Order[] {
  const user = db.users[userId];
  if (!user) return [];
  
  return user.orders
    .map((orderId) => db.orders[orderId])
    .filter((order): order is Order => order !== undefined);
}

export function getProductById(productId: string): Product | undefined {
  return db.products[productId];
}

export function getVariantDetails(productId: string, itemId: string) {
  const product = db.products[productId];
  if (!product) return undefined;
  
  const variant = product.variants[itemId];
  if (!variant) return undefined;
  
  return {
    productName: product.name,
    ...variant,
  };
}

// Stats for the homepage
export function getStats() {
  return {
    totalUsers: Object.keys(db.users).length,
    totalOrders: Object.keys(db.orders).length,
    totalProducts: Object.keys(db.products).length,
  };
}
