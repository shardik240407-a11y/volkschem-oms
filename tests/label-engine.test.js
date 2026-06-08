// ============================================================================
// VOLKSCHEM OMS — Label Engine Tests
// ============================================================================
// Tests all label engine functions with exact business cases.
// ============================================================================

const {
  checkLabelStock,
  calculateLabelSection,
  deductLabelStock,
  validateMinimumBatch,
  validateSufficientStock,
  processBatch,
} = require('../label-engine');

// ════════════════════════════════════════════════════════════════════════════
// LABEL STOCK VALIDATOR
// ════════════════════════════════════════════════════════════════════════════

describe('validateMinimumBatch', () => {
  test('batch of 500 labels should fail validation', () => {
    const result = validateMinimumBatch(500);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Minimum order quantity for labels is 1000');
  });

  test('batch of 999 labels should fail validation', () => {
    const result = validateMinimumBatch(999);
    expect(result.isValid).toBe(false);
  });

  test('batch of 1000 labels should pass validation', () => {
    const result = validateMinimumBatch(1000);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('batch of 5000 labels should pass validation', () => {
    const result = validateMinimumBatch(5000);
    expect(result.isValid).toBe(true);
  });

  test('batch of 0 labels should fail', () => {
    const result = validateMinimumBatch(0);
    expect(result.isValid).toBe(false);
  });

  test('null batchQuantity should fail', () => {
    const result = validateMinimumBatch(null);
    expect(result.isValid).toBe(false);
  });
});

describe('validateSufficientStock', () => {
  test('stock of 800 with order of 1000 should return insufficient with shortfall of 200', () => {
    const result = validateSufficientStock(800, 1000);
    expect(result.isValid).toBe(false);
    expect(result.deficit).toBe(200);
    expect(result.message).toContain('Insufficient');
    expect(result.message).toContain('shortfall: 200');
  });

  test('stock of 1000 with order of 1000 should be sufficient', () => {
    const result = validateSufficientStock(1000, 1000);
    expect(result.isValid).toBe(true);
    expect(result.deficit).toBe(0);
  });

  test('stock of 2000 with order of 500 should be sufficient', () => {
    const result = validateSufficientStock(2000, 500);
    expect(result.isValid).toBe(true);
    expect(result.deficit).toBe(0);
  });

  test('zero stock with any order should be insufficient', () => {
    const result = validateSufficientStock(0, 100);
    expect(result.isValid).toBe(false);
    expect(result.deficit).toBe(100);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CHECK LABEL STOCK
// ════════════════════════════════════════════════════════════════════════════

describe('checkLabelStock', () => {
  test('sufficient stock returns isSufficient true', () => {
    const result = checkLabelStock({
      productId: 'product-1',
      packType: 'bottle',
      packSize: '500ml',
      requiredQuantity: 400,
      currentInventory: { closing_stock: 1000 },
    });
    expect(result.isSufficient).toBe(true);
    expect(result.shortfallQuantity).toBe(0);
    expect(result.currentStock).toBe(1000);
    expect(result.projectedClosingStock).toBe(600);
  });

  test('insufficient stock returns isSufficient false with correct shortfall', () => {
    const result = checkLabelStock({
      productId: 'product-1',
      packType: 'bottle',
      packSize: '500ml',
      requiredQuantity: 1000,
      currentInventory: { closing_stock: 800 },
    });
    expect(result.isSufficient).toBe(false);
    expect(result.shortfallQuantity).toBe(200);
    expect(result.projectedClosingStock).toBe(-200);
  });

  test('null inventory should treat stock as 0', () => {
    const result = checkLabelStock({
      productId: 'product-1',
      packType: 'bottle',
      packSize: '500ml',
      requiredQuantity: 100,
      currentInventory: null,
    });
    expect(result.isSufficient).toBe(false);
    expect(result.currentStock).toBe(0);
    expect(result.shortfallQuantity).toBe(100);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CALCULATE LABEL SECTION
// ════════════════════════════════════════════════════════════════════════════

describe('calculateLabelSection', () => {
  test('should calculate full label section correctly', () => {
    const result = calculateLabelSection({
      currentInventory: { closing_stock: 500 },
      newBatchQuantity: 1000,
      orderQuantity: 400,
      labelRate: 2.50,
    });

    expect(result.openStock).toBe(500);
    expect(result.make).toBe(1000);
    expect(result.totalStock).toBe(1500);
    expect(result.used).toBe(400);
    expect(result.closingStock).toBe(1100);
    expect(result.rate).toBe(2.50);
    expect(result.amount).toBe(1000.0); // 400 × 2.50
    expect(result.gst).toBe(180.0); // 1000 × 0.18
    expect(result.totalWithGst).toBe(1180.0);
  });

  test('should handle zero new batch', () => {
    const result = calculateLabelSection({
      currentInventory: { closing_stock: 800 },
      newBatchQuantity: 0,
      orderQuantity: 200,
      labelRate: 3.00,
    });

    expect(result.openStock).toBe(800);
    expect(result.make).toBe(0);
    expect(result.totalStock).toBe(800);
    expect(result.used).toBe(200);
    expect(result.closingStock).toBe(600);
    expect(result.amount).toBe(600.0); // 200 × 3.00
  });
});

// ════════════════════════════════════════════════════════════════════════════
// DEDUCT LABEL STOCK
// ════════════════════════════════════════════════════════════════════════════

describe('deductLabelStock', () => {
  test('should deduct stock and increase used_to_date', () => {
    const inventory = { closing_stock: 1000, used_to_date: 500 };
    const result = deductLabelStock(inventory, 400);

    expect(result.closing_stock).toBe(600);
    expect(result.used_to_date).toBe(900);
  });

  test('should throw if deduction exceeds available stock', () => {
    const inventory = { closing_stock: 200, used_to_date: 500 };
    expect(() => deductLabelStock(inventory, 300)).toThrow('Insufficient stock');
  });

  test('should handle zero deduction', () => {
    const inventory = { closing_stock: 1000, used_to_date: 500 };
    const result = deductLabelStock(inventory, 0);
    expect(result.closing_stock).toBe(1000);
    expect(result.used_to_date).toBe(500);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// BATCH PROCESSOR
// ════════════════════════════════════════════════════════════════════════════

describe('processBatch', () => {
  test('should process a valid batch of 2000 labels', () => {
    const result = processBatch({
      currentInventory: {
        product_id: 'prod-1',
        total_printed: 5000,
        closing_stock: 800,
      },
      newBatchQuantity: 2000,
      batchRate: 2.50,
    });

    expect(result.updatedInventory.total_printed).toBe(7000);
    expect(result.updatedInventory.closing_stock).toBe(2800);
    expect(result.transaction.transaction_type).toBe('batch_added');
    expect(result.transaction.quantity).toBe(2000);
  });

  test('should throw for batch below 1000 MOQ', () => {
    expect(() =>
      processBatch({
        currentInventory: { total_printed: 5000, closing_stock: 800 },
        newBatchQuantity: 500,
        batchRate: 2.50,
      })
    ).toThrow('Minimum order quantity');
  });

  test('should handle exactly 1000 MOQ', () => {
    const result = processBatch({
      currentInventory: {
        product_id: 'prod-1',
        total_printed: 0,
        closing_stock: 0,
      },
      newBatchQuantity: 1000,
      batchRate: 3.00,
    });

    expect(result.updatedInventory.total_printed).toBe(1000);
    expect(result.updatedInventory.closing_stock).toBe(1000);
  });
});
