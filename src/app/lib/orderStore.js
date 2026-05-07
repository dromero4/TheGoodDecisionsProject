const globalForOrders = globalThis;

if (!globalForOrders.__ORDER_STORE__) {
  globalForOrders.__ORDER_STORE__ = new Map();
}

export const orderStore = globalForOrders.__ORDER_STORE__;

export function saveOrder(orderId, order) {
  orderStore.set(orderId, order);
}

export function getOrder(orderId) {
  return orderStore.get(orderId);
}