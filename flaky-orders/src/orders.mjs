import { InventoryService } from './inventory.mjs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Order intake: accepts order batches and fulfills them against the
 * shared inventory. One instance serves the whole process.
 */
export class OrderService {
  /**
   * @param {InventoryService} inventory
   */
  constructor(inventory = new InventoryService()) {
    this.inventory = inventory;
    this.accepted = 0;
    this.rejected = 0;
  }

  /**
   * Process one order for a single item. Returns 'accepted' or 'rejected'.
   *
   * @param {string} item
   * @param {number} quantity
   */
  async processOrder(item, quantity) {
    // The API gateway spreads dispatch over tens of milliseconds; arrival
    // order is not guaranteed and not observable from here.
    await sleep(Math.random() * 150);
    const ok = await this.inventory.reserve(item, quantity);
    if (ok) {
      this.accepted += 1;
      return 'accepted';
    }
    this.rejected += 1;
    console.error(
      `ORDER REJECTED: insufficient stock for ${item} (requested ${quantity})`,
    );
    return 'rejected';
  }

  /**
   * Process a batch of single-unit orders concurrently, the way the API
   * gateway dispatches them (no ordering guarantees).
   *
   * @param {string} item
   * @param {number} count
   */
  async processBatch(item, count) {
    const results = await Promise.all(
      Array.from({ length: count }, () => this.processOrder(item, 1)),
    );
    return results.filter((r) => r === 'accepted').length;
  }
}
