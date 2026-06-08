// ============================================================================
// VOLKSCHEM OMS — Cost Sheet Rates Seed
// Source: 4 cost sheet images dated 12-03-2026
// Every container type, every size, every rate — zero omissions.
// ============================================================================

/**
 * Complete cost sheet rate data extracted from:
 *   1. Bottle Ampoules Drum Cost Sheet.jpeg
 *   2. Bottle Ampoules Drum Cost Sheet 2.jpeg
 *   3. Lable Pouch cost.jpeg
 *   4. Carton Box Rate.jpeg
 *
 * Categories:
 *   bottles, ampoules, labels, pouches, cartons,
 *   fbb_boxes, trays, inner_boxes, shrink_caps,
 *   buckets, drums, jars_dabbas
 */
const COST_SHEET_DATA = [

  // =========================================================================
  // BOTTLES
  // =========================================================================

  // --- Nocil Shape Bottle (Green) ---
  { category: 'bottles', item_name: 'Nocil Shape Bottle (Green)', size: '1 LTR', rate: 36.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Nocil Shape Bottle (Green)', size: '500 ML', rate: 24.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Nocil Shape Bottle (Green)', size: '250 ML', rate: 17.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Nocil Shape Bottle (Green)', size: '100 ML', rate: 11.00, unit: 'per_pcs' },

  // --- Glypho Green Bottle ---
  { category: 'bottles', item_name: 'Glypho Green Bottle', size: '5 LTR', rate: 80.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Glypho Green Bottle', size: '1 LTR', rate: 32.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Glypho Green Bottle', size: '500 ML', rate: 20.00, unit: 'per_pcs' },

  // --- PET Regular Shape Bottle ---
  { category: 'bottles', item_name: 'PET Regular Shape Bottle', size: '1 LTR', rate: 18.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Regular Shape Bottle', size: '500 ML', rate: 14.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Regular Shape Bottle', size: '250 ML', rate: 10.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Regular Shape Bottle', size: '100 ML', rate: 9.00, unit: 'per_pcs' },

  // --- PET "Y" Shape Bottle ---
  { category: 'bottles', item_name: 'PET Y Shape Bottle', size: '1 LTR', rate: 22.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Y Shape Bottle', size: '500 ML', rate: 15.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Y Shape Bottle', size: '250 ML', rate: 11.25, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'PET Y Shape Bottle', size: '100 ML', rate: 8.50, unit: 'per_pcs' },

  // --- PET Bottle (Pretila) ---
  { category: 'bottles', item_name: 'PET Bottle (Pretila)', size: '3.5 LTR', rate: 20.00, unit: 'per_pcs' },

  // --- PET Bottle (plain) ---
  { category: 'bottles', item_name: 'PET Bottle', size: '200 ML', rate: 4.50, unit: 'per_pcs' },

  // --- Aluminium Bottle (SD-SS Shape) ---
  { category: 'bottles', item_name: 'Aluminium Bottle (SD-SS Shape)', size: '1 LTR', rate: 72.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (SD-SS Shape)', size: '500 ML', rate: 45.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (SD-SS Shape)', size: '250 ML', rate: 29.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (SD-SS Shape)', size: '100 ML', rate: 21.00, unit: 'per_pcs' },

  // --- Aluminium Bottle (Indoxa Shape) ---
  { category: 'bottles', item_name: 'Aluminium Bottle (Indoxa Shape)', size: '1 LTR', rate: 72.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (Indoxa Shape)', size: '500 ML', rate: 45.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (Indoxa Shape)', size: '250 ML', rate: 29.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (Indoxa Shape)', size: '100 ML', rate: 17.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Aluminium Bottle (Indoxa Shape)', size: '50 ML', rate: 14.00, unit: 'per_pcs' },

  // --- Imida Bottle ---
  { category: 'bottles', item_name: 'Imida Bottle', size: '1 LTR', rate: 29.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '500 ML', rate: 18.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '250 ML', rate: 13.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '100 ML', rate: 8.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '50 ML', rate: 6.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '30 ML', rate: 4.20, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '20-25 ML', rate: 4.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '15 ML', rate: 3.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Imida Bottle', size: '5-10 ML', rate: 3.20, unit: 'per_pcs' },

  // --- Diamond / Rivet / VV Octagon / Sygenta Bottle ---
  { category: 'bottles', item_name: 'Diamond Rivet VV Octagon Sygenta Bottle', size: '1 LTR', rate: 32.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Diamond Rivet VV Octagon Sygenta Bottle', size: '500 ML', rate: 20.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Diamond Rivet VV Octagon Sygenta Bottle', size: '250 ML', rate: 14.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Diamond Rivet VV Octagon Sygenta Bottle', size: '100 ML', rate: 8.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Diamond Rivet VV Octagon Sygenta Bottle', size: '50 ML', rate: 6.50, unit: 'per_pcs' },

  // --- Coragan Bottle ---
  { category: 'bottles', item_name: 'Coragan Bottle', size: '300 ML', rate: 15.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Coragan Bottle', size: '150 ML', rate: 12.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Coragan Bottle', size: '60 ML', rate: 10.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Coragan Bottle', size: '30 ML', rate: 8.00, unit: 'per_pcs' },

  // --- Sq. White / Golden Amway / Round Golden Bottle ---
  { category: 'bottles', item_name: 'Sq White Golden Amway Round Golden Bottle', size: '1 LTR', rate: 42.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq White Golden Amway Round Golden Bottle', size: '500 ML', rate: 26.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq White Golden Amway Round Golden Bottle', size: '250 ML', rate: 18.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq White Golden Amway Round Golden Bottle', size: '100 ML', rate: 10.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq White Golden Amway Round Golden Bottle', size: '50 ML', rate: 6.50, unit: 'per_pcs' },

  // --- Sq. Biswin / Golden Bottle ---
  { category: 'bottles', item_name: 'Sq Biswin Golden Bottle', size: '1 LTR', rate: 42.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq Biswin Golden Bottle', size: '500 ML', rate: 26.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq Biswin Golden Bottle', size: '250 ML', rate: 18.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq Biswin Golden Bottle', size: '100 ML', rate: 10.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Sq Biswin Golden Bottle', size: '25 ML', rate: 7.50, unit: 'per_pcs' },

  // --- Hexa Shape / Total Shape Bottle ---
  { category: 'bottles', item_name: 'Hexa Shape Total Shape Bottle', size: '1 LTR', rate: 32.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Hexa Shape Total Shape Bottle', size: '500 ML', rate: 20.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Hexa Shape Total Shape Bottle', size: '250 ML', rate: 14.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Hexa Shape Total Shape Bottle', size: '100 ML', rate: 8.50, unit: 'per_pcs' },

  // --- Tween Neck Bottle ---
  { category: 'bottles', item_name: 'Tween Neck Bottle', size: '1 LTR', rate: 37.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Tween Neck Bottle', size: '500 ML', rate: 28.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Tween Neck Bottle', size: '250 ML', rate: 22.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Tween Neck Bottle', size: '100 ML', rate: 17.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Tween Neck Bottle', size: '50 ML', rate: 13.00, unit: 'per_pcs' },

  // --- CO-EX Bottle (SI / 01 Shape) ---
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '1 LTR', rate: 45.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '700 ML', rate: 41.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '500 ML', rate: 31.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '350 ML', rate: 30.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '250 ML', rate: 24.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'CO-EX Bottle (SI-01 Shape)', size: '100 ML', rate: 14.00, unit: 'per_pcs' },

  // --- Bottle (SI-01 Shape) ---
  { category: 'bottles', item_name: 'Bottle (SI-01 Shape)', size: '500 ML', rate: 19.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Bottle (SI-01 Shape)', size: '250 ML', rate: 14.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Bottle (SI-01 Shape)', size: '160 ML', rate: 11.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Bottle (SI-01 Shape)', size: '100 ML', rate: 8.50, unit: 'per_pcs' },

  // --- Round Can / Drum HDPE ---
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '5 LTR', rate: 85.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '10 LTR', rate: 150.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '15 LTR', rate: 200.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '25 LTR', rate: 300.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '35 LTR', rate: 350.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '50 LTR', rate: 400.00, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Round Can / Drum HDPE', size: '200 LTR', rate: 1300.00, unit: 'per_pcs' },

  // --- Eye Drop ---
  { category: 'bottles', item_name: 'Eye Drop Bottle', size: '5-10 ML', rate: 3.00, unit: 'per_pcs' },

  // --- Measuring Cap ---
  { category: 'bottles', item_name: 'Measuring Cap', size: '25 ML', rate: 2.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Measuring Cap', size: '50 ML', rate: 3.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Measuring Cap', size: '75 ML', rate: 4.50, unit: 'per_pcs' },
  { category: 'bottles', item_name: 'Measuring Cap', size: 'BIG CAP', rate: 6.50, unit: 'per_pcs' },

  // --- PET Jar ---
  { category: 'bottles', item_name: 'PET Jar', size: '1 KG', rate: 20.00, unit: 'per_pcs' },

  // =========================================================================
  // AMPOULES
  // =========================================================================

  // --- Ampoule Glass ---
  { category: 'ampoules', item_name: 'Ampoule Glass', size: '2 ML', rate: 1.50, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Glass', size: '5 ML', rate: 1.70, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Glass', size: '10 ML', rate: 2.40, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Glass', size: '20 ML', rate: 4.00, unit: 'per_pcs' },

  // --- Ampoule Label ---
  { category: 'ampoules', item_name: 'Ampoule Label', size: '2 ML', rate: 0.90, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Label', size: '5 ML', rate: 1.00, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Label', size: '10 ML', rate: 1.20, unit: 'per_pcs' },
  { category: 'ampoules', item_name: 'Ampoule Label', size: '20 ML', rate: 1.50, unit: 'per_pcs' },

  // =========================================================================
  // TRAYS (Ampoule FBB Box / Tray)
  // =========================================================================

  // --- Ampoule Tray ---
  { category: 'trays', item_name: 'Ampoule Tray', size: '2 ML', rate: 0.60, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule Tray', size: '5 ML', rate: 0.80, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule Tray', size: '10 ML', rate: 1.00, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule Tray', size: '20 ML', rate: 1.80, unit: 'per_pcs' },

  // --- Ampoule FBB Box ---
  { category: 'trays', item_name: 'Ampoule FBB Box', size: '2 ML', rate: 0.70, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule FBB Box', size: '5 ML', rate: 0.90, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule FBB Box', size: '10 ML', rate: 1.80, unit: 'per_pcs' },
  { category: 'trays', item_name: 'Ampoule FBB Box', size: '20 ML', rate: 2.00, unit: 'per_pcs' },

  // =========================================================================
  // LABELS
  // =========================================================================

  // --- Label for Bottle ---
  { category: 'labels', item_name: 'Label Bottle', size: '1 LTR', rate: 6.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Bottle', size: '500 ML', rate: 4.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Bottle', size: '250 ML', rate: 3.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Bottle', size: '100 ML', rate: 2.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Bottle', size: '50 ML', rate: 1.80, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Bottle', size: '20/25 ML', rate: 1.50, unit: 'per_pcs' },

  // --- Label for Powder / Flaks ---
  { category: 'labels', item_name: 'Label Powder Flaks', size: '1 KG', rate: 7.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Powder Flaks', size: '500 GM', rate: 5.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Powder Flaks', size: '250 GM', rate: 4.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Powder Flaks', size: '100 GM', rate: 3.00, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Powder Flaks', size: '50 GM', rate: 2.20, unit: 'per_pcs' },
  { category: 'labels', item_name: 'Label Powder Flaks', size: '25 GM', rate: 2.00, unit: 'per_pcs' },

  // =========================================================================
  // POUCHES
  // =========================================================================

  // --- Common Pouch for Powder ---
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '1 KG', rate: 6.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '500 GM', rate: 4.50, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '250 GM', rate: 3.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '100 GM', rate: 2.50, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '50 GM', rate: 2.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '25 GM', rate: 1.50, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Common Pouch for Powder', size: '15-20 GM', rate: 1.00, unit: 'per_pcs' },

  // --- Printing Pouch for Powder ---
  { category: 'pouches', item_name: 'Printing Pouch for Powder', size: '250 GM', rate: 10.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Powder', size: '100 GM', rate: 8.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Powder', size: '50 GM', rate: 6.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Powder', size: '25 GM', rate: 4.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Powder', size: '15-20 GM', rate: 3.00, unit: 'per_pcs' },

  // --- Printing Pouch for Granules ---
  { category: 'pouches', item_name: 'Printing Pouch for Granules', size: '5 KG', rate: 22.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Granules', size: '1 KG', rate: 13.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Granules', size: '500 GM', rate: 10.00, unit: 'per_pcs' },
  { category: 'pouches', item_name: 'Printing Pouch for Granules', size: '250 GM', rate: 8.00, unit: 'per_pcs' },

  // =========================================================================
  // CARTONS
  // =========================================================================

  // --- Carton Box for Pouch ---
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '5 KG', rate: 12.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '2.5/3 KG', rate: 7.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '2 KG', rate: 4.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '1 KG', rate: 2.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '500 GM', rate: 4.00, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '250 GM', rate: 2.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '100 GM (40 nos)', rate: 1.20, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '50 GM (20 nos)', rate: 1.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '100 GM (100 nos)', rate: 0.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '50 GM (50 nos)', rate: 0.80, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '15/20 GM', rate: 0.30, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '10 GM (50x4)', rate: 0.15, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Pouch', size: '10 GM (200 nos)', rate: 0.18, unit: 'per_pcs' },

  // --- Carton Box for Dabba ---
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '1 KG', rate: 5.00, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '500 GM', rate: 3.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '250 GM (40 nos)', rate: 1.75, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '250 GM (20 nos)', rate: 25.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '100 GM', rate: 1.30, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '50 GM (50 nos)', rate: 1.20, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '50 GM (100 nos)', rate: 0.90, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box Dabba', size: '25 GM', rate: 0.60, unit: 'per_pcs' },

  // --- Carton Box for HDEP Bottle / Alu. Bottle ---
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '15 LTR', rate: 40.00, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '5 LTR (2 nos)', rate: 20.00, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '5 LTR (4 nos)', rate: 12.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '1 LTR (10 nos)', rate: 4.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '1 LTR', rate: 2.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '500 ML', rate: 2.25, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '250 ML', rate: 1.75, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '150 ML', rate: 1.50, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '100 ML (50 nos)', rate: 1.00, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '100 ML (100 nos)', rate: 0.70, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '60 ML', rate: 0.80, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '50 ML (50 nos)', rate: 0.75, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '30 ML', rate: 0.55, unit: 'per_pcs' },
  { category: 'cartons', item_name: 'Carton Box HDEP/Alu Bottle', size: '50 ML (100 nos)', rate: 0.40, unit: 'per_pcs' },

  // =========================================================================
  // FBB BOXES
  // =========================================================================

  // --- FBB Box for Bottle ---
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '1 LTR', rate: 18.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '500 ML', rate: 16.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '250 ML', rate: 14.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '100 ML', rate: 12.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '50 ML', rate: 8.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Bottle', size: '20/25 ML', rate: 6.00, unit: 'per_pcs' },

  // --- FBB Box for Pouch (Powder) ---
  { category: 'fbb_boxes', item_name: 'FBB Box Pouch', size: '1 KG', rate: 14.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Pouch', size: '500 GM', rate: 12.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Pouch', size: '250 GM', rate: 10.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Pouch', size: '100 GM', rate: 8.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'FBB Box Pouch', size: '50 GM', rate: 6.00, unit: 'per_pcs' },

  // --- Corrugated Box ---
  { category: 'fbb_boxes', item_name: 'Corrugated Box', size: '1 KG', rate: 22.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'Corrugated Box', size: '500 GM', rate: 18.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'Corrugated Box', size: '250 GM', rate: 16.00, unit: 'per_pcs' },
  { category: 'fbb_boxes', item_name: 'Corrugated Box', size: '100 GM', rate: 14.00, unit: 'per_pcs' },

  // =========================================================================
  // INNER BOXES
  // =========================================================================

  { category: 'inner_boxes', item_name: 'Inner Box', size: '20/25 ML (200 nos)', rate: 0.25, unit: 'per_pcs' },
  { category: 'inner_boxes', item_name: 'Inner Box', size: '10/15 ML (200 nos)', rate: 0.23, unit: 'per_pcs' },
  { category: 'inner_boxes', item_name: 'Inner Box', size: '20 ML (50 nos)', rate: 0.20, unit: 'per_pcs' },
  { category: 'inner_boxes', item_name: 'Inner Box', size: '25 ML (50 nos)', rate: 0.25, unit: 'per_pcs' },
  { category: 'inner_boxes', item_name: 'Inner Box', size: '10 ML (100 nos)', rate: 0.15, unit: 'per_pcs' },

  // =========================================================================
  // DRUMS (for Granules)
  // =========================================================================

  { category: 'drums', item_name: 'Drum (Granules)', size: '25 KG', rate: 320.00, unit: 'per_pcs' },
  { category: 'drums', item_name: 'Drum (Granules)', size: '50 KG', rate: 420.00, unit: 'per_pcs' },
  { category: 'drums', item_name: 'Drum (Granules)', size: '65 KG', rate: 460.00, unit: 'per_pcs' },

  // =========================================================================
  // BUCKETS
  // =========================================================================

  { category: 'buckets', item_name: 'Bucket Printing (Granules)', size: '5/6 KG', rate: 80.00, unit: 'per_pcs' },
  { category: 'buckets', item_name: 'Bucket Printing (Granules)', size: '10/12 KG', rate: 130.00, unit: 'per_pcs' },
  { category: 'buckets', item_name: 'Bucket Printing (Granules)', size: '15 KG', rate: 160.00, unit: 'per_pcs' },
  { category: 'buckets', item_name: 'Bucket Printing (Granules)', size: '20/25 KG', rate: 200.00, unit: 'per_pcs' },

  // =========================================================================
  // JARS / DABBAS
  // =========================================================================

  // --- Proclame Dabba ---
  { category: 'jars_dabbas', item_name: 'Proclame Dabba', size: '1 KG', rate: 60.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba', size: '500 GM', rate: 33.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba', size: '250 GM', rate: 22.50, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba', size: '100 GM', rate: 16.50, unit: 'per_pcs' },

  // --- Proclame Dabba (Benzowin) ---
  { category: 'jars_dabbas', item_name: 'Proclame Dabba (Benzowin)', size: '1 KG', rate: 60.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba (Benzowin)', size: '500 GM', rate: 32.50, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba (Benzowin)', size: '250 GM', rate: 22.50, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Proclame Dabba (Benzowin)', size: '100 GM', rate: 16.50, unit: 'per_pcs' },

  // --- Jar (Denfen) Dabba (Om Shanti) ---
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '1 KG', rate: 43.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '500 GM', rate: 31.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '250 GM', rate: 20.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '100 GM', rate: 15.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '50 GM', rate: 13.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Jar Denfen Dabba (Om Shanti)', size: '25 GM', rate: 10.00, unit: 'per_pcs' },

  // --- Thayo Dabba (Harsh) ---
  { category: 'jars_dabbas', item_name: 'Thayo Dabba (Harsh)', size: '1 KG', rate: 43.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Thayo Dabba (Harsh)', size: '500 GM', rate: 31.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Thayo Dabba (Harsh)', size: '250 GM', rate: 20.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Thayo Dabba (Harsh)', size: '100 GM', rate: 15.00, unit: 'per_pcs' },

  // --- New Jar Dabba (Space) ---
  { category: 'jars_dabbas', item_name: 'New Jar Dabba (Space)', size: '1 KG', rate: 43.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'New Jar Dabba (Space)', size: '500 GM', rate: 31.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'New Jar Dabba (Space)', size: '250 GM', rate: 20.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'New Jar Dabba (Space)', size: '100 GM', rate: 15.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'New Jar Dabba (Space)', size: '50 GM', rate: 13.50, unit: 'per_pcs' },

  // --- Hy-Max Dabba (Parth) ---
  { category: 'jars_dabbas', item_name: 'Hy-Max Dabba (Parth)', size: '1 KG', rate: 40.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Hy-Max Dabba (Parth)', size: '500 GM', rate: 31.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Hy-Max Dabba (Parth)', size: '250 GM', rate: 21.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Hy-Max Dabba (Parth)', size: '100 GM', rate: 15.00, unit: 'per_pcs' },
  { category: 'jars_dabbas', item_name: 'Hy-Max Dabba (Parth)', size: '50 GM', rate: 13.00, unit: 'per_pcs' },

  // =========================================================================
  // SHRINK CAPS
  // =========================================================================

  { category: 'shrink_caps', item_name: 'Shrink Cap', size: '50 ML', rate: 14.50, unit: 'per_pcs' },
];

/**
 * Seeds all cost sheet rates into the cost_sheet_rates table.
 * Clears existing data first for a clean re-seed.
 *
 * @param {import('pg').Pool} pool - PostgreSQL connection pool
 */
async function seedCostSheetRates(pool) {
  console.log('\n📋 Seeding cost sheet rates...');
  console.log(`   Total entries to seed: ${COST_SHEET_DATA.length}`);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing cost sheet rates for a clean seed
    const deleteResult = await client.query('DELETE FROM cost_sheet_rates');
    console.log(`   🗑️  Cleared ${deleteResult.rowCount} existing rate(s)`);

    // Build batch insert query for performance
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    for (const entry of COST_SHEET_DATA) {
      placeholders.push(
        `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
      );
      values.push(
        entry.category,
        entry.item_name,
        entry.size,
        entry.rate,
        entry.unit || null
      );
    }

    const insertQuery = `
      INSERT INTO cost_sheet_rates (category, item_name, size, rate, unit)
      VALUES ${placeholders.join(',\n             ')}
    `;

    const insertResult = await client.query(insertQuery, values);

    await client.query('COMMIT');

    console.log(`   ✅ Inserted ${insertResult.rowCount} cost sheet rate(s)`);

    // Print summary by category
    const categorySummary = {};
    for (const entry of COST_SHEET_DATA) {
      categorySummary[entry.category] = (categorySummary[entry.category] || 0) + 1;
    }
    console.log('\n   📊 Breakdown by category:');
    for (const [category, count] of Object.entries(categorySummary)) {
      console.log(`      ${category.padEnd(15)} → ${count} entries`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('   ❌ Failed to seed cost sheet rates:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { seedCostSheetRates, COST_SHEET_DATA };
