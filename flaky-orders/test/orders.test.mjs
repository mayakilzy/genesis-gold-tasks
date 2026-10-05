import { test } from 'node:test';
import assert from 'node:assert/strict';

import { InventoryService } from '../src/inventory.mjs';
import { OrderService } from '../src/orders.mjs';

// The invariant the business depends on: we can never sell more units of
// an item than were in stock, and the inventory can never go negative.
test('a concurrent batch never oversells the available stock', async () => {
  const inventory = new InventoryService({ widget: 8 });
  const orders = new OrderService(inventory);

  const accepted = await orders.processBatch('widget', 12);

  assert.equal(accepted, 8, 'exactly the available stock may be accepted');
  assert.equal(
    await inventory.level('widget'),
    0,
    'stock must reach exactly zero',
  );
  assert.equal(orders.rejected, 4, 'the excess orders must be rejected');
});

test('sequential reservations respect the stock level', async () => {
  const inventory = new InventoryService({ gear: 3 });
  const orders = new OrderService(inventory);
  const results = [];
  for (let i = 0; i < 5; i += 1) {
    results.push(await orders.processOrder('gear', 1));
  }
  assert.deepEqual(results, [
    'accepted',
    'accepted',
    'accepted',
    'rejected',
    'rejected',
  ]);
});
