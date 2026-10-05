/**
 * In-memory inventory with a simulated async store latency.
 *
 * Production notes: the same class runs in the staging cluster behind the
 * orders API. Stock levels are small integers per SKU.
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class InventoryService {
  /** @param {Record<string, number>} stock initial stock per SKU */
  constructor(stock = { widget: 8, gear: 3 }) {
    this.stock = { ...stock };
  }

  /**
   * Simulated store lookup latency (staging measures 0-2ms per call).
   * @param {string} item
   */
  async lookup(item) {
    await sleep(Math.random() * 2);
    return this.stock[item] ?? 0;
  }

  /**
   * Reserve stock for an order. Returns true when the reservation
   * succeeded, false when there was not enough stock.
   *
   * @param {string} item
   * @param {number} quantity
   */
  async reserve(item, quantity) {
    const available = await this.lookup(item);
    if (available < quantity) {
      return false;
    }
    // Simulated validation latency (staging measures 0-2ms): the write
    // lands some time after the read that justified it.
    await sleep(Math.random() * 2);
    this.stock[item] = available - quantity;
    return true;
  }

  /** Current stock for an item (read-through). */
  async level(item) {
    return this.lookup(item);
  }
}
