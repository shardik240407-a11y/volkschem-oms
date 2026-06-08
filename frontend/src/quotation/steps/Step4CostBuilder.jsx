import { useState, useEffect, useMemo } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import { costSheetService, labelService } from '../../services/dataService';
import ComponentCheckboxRow from '../components/ComponentCheckboxRow';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

import { AMPOULE_PACKAGING } from '../../utils/constants';

/**
 * STRICT COMPONENT RULES PER PACKING TYPE (from quotation PDFs)
 */
const COMPONENT_MAP = {
  Bottle:      ['Bulk Material', 'Bottle', 'Label', 'Shrink Cap', 'Carton Box', 'Job Work'],
  Ampoule:     ['Bulk Material', 'Ampoule Glass', 'Label', 'Tray', 'FBB Box', 'Inner Box', 'Outer Box', 'Job Work'],
  Pouch:       ['Bulk Material', 'Pouch', 'Carton Box', 'Job Work'],
  'Jar/Dabba': ['Bulk Material', 'Jar/Dabba', 'Label', 'Carton Box', 'Job Work'],
  Bucket:      ['Bulk Material', 'Bucket', 'Job Work'],
  Drum:        ['Bulk Material', 'Drum', 'Job Work'],
};

const SMALL_BOTTLE_SIZES = ['1ml', '2ml', '5ml', '10ml', '25ml'];
const NO_LABEL_TYPES = ['Bucket', 'Drum', 'Pouch'];

// Components that need NO division — rate is per piece directly
const NO_DIVISION = new Set([
  'Bulk Material', 'Ampoule Glass', 'Label', 'Shrink Cap',
  'Bottle', 'Pouch', 'Jar/Dabba', 'Bucket', 'Drum', 'Job Work',
]);

function calcBulkCost(packSizeValue, packSizeUnit, bulkRate) {
  if (!packSizeValue || !bulkRate) return 0;
  let v = packSizeValue;
  const u = packSizeUnit?.toLowerCase();
  if (u === 'ml') v /= 1000;
  else if (u === 'gm') v /= 1000;
  return parseFloat((v * bulkRate).toFixed(4));
}

/**
 * Get divisor for a component so cost per piece = appliedRate / divisor
 */
function getDivisor(componentName, packingType, packSize, nosPerCarton) {
  if (NO_DIVISION.has(componentName)) {
    return { divisor: 1, label: '' };
  }

  // Carton Box
  if (componentName === 'Carton Box') {
    const d = parseInt(nosPerCarton) || 1;
    return { divisor: d, label: `${d} nos per carton` };
  }

  // Ampoule packaging
  if (packingType === 'Ampoule') {
    const spec = AMPOULE_PACKAGING[packSize];
    if (!spec) return { divisor: 1, label: '' };
    switch (componentName) {
      case 'Tray':      return { divisor: spec.trayPcs,     label: `${spec.trayPcs} pcs per tray` };
      case 'FBB Box':   return { divisor: spec.fbbBoxPcs,   label: `${spec.fbbBoxPcs} pcs per FBB Box` };
      case 'Inner Box': return { divisor: spec.innerBoxPcs, label: `${spec.innerBoxPcs} pcs per inner box` };
      case 'Outer Box': return { divisor: spec.outerBoxPcs, label: `${spec.outerBoxPcs} pcs per outer box` };
      default: return { divisor: 1, label: '' };
    }
  }

  return { divisor: 1, label: '' };
}

// ── Label Batch UI ────────────────────────────────────────────────────────────
function LabelBatchUI({ totalPcs, available, productId, packType, packSize, onConfirmed }) {
  const [qty, setQty] = useState(1000);
  const [rate, setRate] = useState('');
  const [qtyError, setQtyError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [batchInfo, setBatchInfo] = useState(null);

  const amount = parseFloat(rate) > 0 && qty > 0 ? qty * parseFloat(rate) : 0;
  const gst = amount * 0.18;
  const totalWithGst = amount + gst;

  const handleConfirm = async () => {
    if (parseInt(qty) < 1000) { setQtyError('Minimum label batch is 1000 pieces (MOQ).'); return; }
    if (!rate || parseFloat(rate) <= 0) { setQtyError('Please enter a valid rate per label.'); return; }
    setQtyError('');
    setSaving(true);
    try {
      await labelService.addBatch({
        product_id: productId,
        pack_type: packType,
        pack_size: packSize,
        quantity: parseInt(qty),
        batch_rate: parseFloat(rate),
      });
      const info = {
        quantity: parseInt(qty),
        rate: parseFloat(rate),
        amount, gst, totalWithGst,
        closingStock: parseInt(qty) - totalPcs,
      };
      setBatchInfo(info);
      setConfirmed(true);
      onConfirmed(info);
      toast.success(`Label batch of ${parseInt(qty).toLocaleString()} added successfully.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add label batch.');
    } finally { setSaving(false); }
  };

  if (confirmed && batchInfo) {
    return (
      <div className="mb-5 px-5 py-4 bg-success-light border border-success/30 rounded-xl flex items-start gap-3">
        <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-success">
            Label Batch Added — {batchInfo.quantity.toLocaleString()} labels added to stock
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Closing stock after this order: {batchInfo.closingStock.toLocaleString()} labels ·
            Batch cost: ₹{batchInfo.amount.toFixed(2)} + GST ₹{batchInfo.gst.toFixed(2)} = ₹{batchInfo.totalWithGst.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl overflow-hidden border border-error/40">
      <div className="px-5 py-3.5 bg-error-light border-b border-error/30 flex items-start gap-3">
        <AlertTriangle size={18} className="text-error flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-error">Insufficient Labels — Only {available?.toLocaleString() || 0} Labels Remaining</p>
          <p className="text-sm text-error/80 mt-0.5">
            This order requires <strong>{totalPcs?.toLocaleString()}</strong> labels. Add a new batch below (min. 1000).
          </p>
        </div>
      </div>
      <div className="px-5 py-4 bg-white space-y-4">
        <p className="text-sm font-semibold text-text-primary">Add Label Batch</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Batch Qty (min 1000)</label>
            <input type="number" min="1000" step="100"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-lighter ${qtyError ? 'border-error' : 'border-border'}`}
              value={qty} onChange={(e) => { setQty(e.target.value); setQtyError(''); }}
              onBlur={() => { if (parseInt(qty) < 1000) setQtyError('Minimum label batch is 1000 pieces (MOQ).'); }}
            />
            {qtyError && <p className="text-xs text-error mt-1">{qtyError}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Rate per Label (₹)</label>
            <input type="number" min="0" step="0.01" placeholder="e.g. 0.95"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-lighter"
              value={rate} onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="bg-surface-alt rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between text-text-secondary"><span>Amount:</span><span>₹ {amount.toFixed(2)}</span></div>
            <div className="flex justify-between text-text-secondary"><span>GST @18%:</span><span>₹ {gst.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-text-primary border-t border-border pt-1 mt-1"><span>Total:</span><span>₹ {totalWithGst.toFixed(2)}</span></div>
          </div>
        </div>
        <button onClick={handleConfirm} disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
          <Check size={16} />
          {saving ? 'Saving...' : 'Confirm Add Batch'}
        </button>
      </div>
    </div>
  );
}

// ── Main Component Builder ────────────────────────────────────────────────────
export default function Step4CostBuilder() {
  const { state, updateField } = useQuotation();
  const [components, setComponents] = useState([]);
  const [customLines, setCustomLines] = useState([]);
  const [fetchedRates, setFetchedRates] = useState({});

  const packingType = state.packingType;
  const packSize = state.packSize;
  const product = state.product;
  const bulkRate = state.productBulkRate || product?.bulk_rate_per_ltr_kg || 0;
  const bulkCost = calcBulkCost(state.packSizeValue, state.packSizeUnit, bulkRate);
  const nosPerCarton = parseInt(state.rows?.[0]?.nosPerCarton) || 1;

  // Build allowed components for this packing type
  let allowedComponents = COMPONENT_MAP[packingType] || [];
  if (packingType === 'Bottle' && SMALL_BOTTLE_SIZES.includes(packSize)) {
    allowedComponents = allowedComponents.filter((c) => c !== 'Shrink Cap');
  }

  // Fetch all cost-sheet rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      const rates = {};
      const categories = [
        'bottles', 'ampoules', 'bottle_labels', 'ampoule_labels', 'labels',
        'pouches', 'cartons', 'fbb_boxes', 'trays', 'inner_boxes', 'outer_boxes',
        'shrink_caps', 'buckets', 'drums', 'jars',
      ];
      try {
        const results = await Promise.allSettled(
          categories.map((cat) => costSheetService.getRatesByCategory(cat))
        );
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            rates[`_cat_${categories[i]}`] = r.value.data?.data || [];
          }
        });
      } catch { /* best effort */ }
      setFetchedRates(rates);
    };
    fetchRates();
  }, []);

  // Build component list whenever packing/size/rates change
  useEffect(() => {
    const findRate = (catKey, variant, size) => {
      const items = fetchedRates[`_cat_${catKey}`] || [];
      const norm = (s) => (s || '').toString().toLowerCase().replace(/\s+/g, '');
      const nSize = norm(size);
      
      const exact = items.find(
        (i) =>
          (!variant || i.item_name?.toLowerCase().includes(variant.toLowerCase()) ||
            i.component_name?.toLowerCase().includes(variant.toLowerCase())) &&
          (norm(i.size) === nSize || norm(i.pack_size) === nSize)
      );
      if (exact) return exact.rate || 0;
      const sizeOnly = items.find((i) => norm(i.size) === nSize || norm(i.pack_size) === nSize);
      if (sizeOnly) return sizeOnly.rate || 0;
      return items[0]?.rate || 0;
    };

    const comps = allowedComponents.map((name) => {
      let defaultRate = 0;
      let variantLabel = '';
      let isBulk = false;

      switch (name) {
        case 'Bulk Material':
          isBulk = true;
          defaultRate = bulkCost;
          variantLabel = `${state.packSizeValue}${state.packSizeUnit} @ ₹${bulkRate}/${product?.rate_unit === 'kg' ? 'Kg' : 'Ltr'}`;
          break;
        case 'Bottle':
          variantLabel = state.packingVariant || '';
          defaultRate = findRate('bottles', state.packingVariant, packSize);
          break;
        case 'Ampoule Glass':
          variantLabel = packSize;
          defaultRate = findRate('ampoules', 'Ampoule', packSize);
          break;
        case 'Label':
          // FIX 3: Use correct category based on packing type
          if (packingType === 'Ampoule') {
            defaultRate = findRate('ampoule_labels', 'Label', packSize);
          } else {
            defaultRate = findRate('bottle_labels', 'Label', packSize) || findRate('labels', 'Label', packSize);
          }
          break;
        case 'Shrink Cap':
          defaultRate = findRate('shrink_caps', 'Shrink', packSize);
          break;
        case 'Carton Box':
          defaultRate = findRate('cartons', 'Carton', packSize);
          break;
        case 'Tray':
          defaultRate = findRate('trays', 'Tray', packSize);
          break;
        case 'FBB Box':
          defaultRate = findRate('fbb_boxes', 'FBB', packSize);
          break;
        case 'Inner Box':
          defaultRate = findRate('inner_boxes', 'Inner', packSize);
          break;
        case 'Outer Box':
          defaultRate = findRate('outer_boxes', 'Outer', packSize);
          break;
        case 'Pouch':
          variantLabel = state.packingVariant || '';
          defaultRate = findRate('pouches', state.packingVariant, packSize);
          break;
        case 'Jar/Dabba':
          variantLabel = state.packingVariant || '';
          defaultRate = findRate('jars', state.packingVariant, packSize);
          break;
        case 'Bucket':
          defaultRate = findRate('buckets', 'Bucket', packSize);
          break;
        case 'Drum':
          defaultRate = findRate('drums', 'Drum', packSize);
          break;
        case 'Job Work':
        default:
          defaultRate = 0;
      }

      return {
        name,
        variantLabel,
        isChecked: true,
        canUncheck: name !== 'Bulk Material',
        isBulk,
        defaultRate,
        appliedRate: isBulk ? bulkCost : defaultRate,
      };
    });

    setComponents(comps);
  }, [allowedComponents.join(','), bulkCost, fetchedRates, packSize, bulkRate]);

  const updateComponent = (index, field, value) => {
    setComponents((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addCustomLine = () => setCustomLines((prev) => [...prev, { name: '', rate: 0 }]);
  const updateCustomLine = (index, field, value) =>
    setCustomLines((prev) => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n; });
  const removeCustomLine = (index) =>
    setCustomLines((prev) => prev.filter((_, i) => i !== index));

  // FIX 5: Calculate cost per piece using CORRECTED values (after division)
  const costPerPcs = useMemo(() => {
    let total = 0;
    components.forEach((c) => {
      if (!c.isChecked) return;
      if (c.isBulk) {
        total += bulkCost;
      } else {
        const { divisor } = getDivisor(c.name, packingType, packSize, nosPerCarton);
        total += (c.appliedRate || 0) / divisor;
      }
    });
    customLines.forEach((cl) => { total += cl.rate || 0; });
    return Math.round(total * 10000) / 10000;
  }, [components, customLines, bulkCost, packingType, packSize, nosPerCarton]);

  // Sync to context whenever components change
  useEffect(() => {
    const mapped = components.map((c) => {
      const { divisor } = getDivisor(c.name, packingType, packSize, nosPerCarton);
      const cpp = c.isChecked ? (c.isBulk ? bulkCost : (c.appliedRate || 0) / divisor) : 0;
      return {
        component_name: c.name,
        is_checked: c.isChecked,
        default_rate: c.defaultRate,
        applied_rate: c.appliedRate,
        cost_per_pcs: Math.round(cpp * 10000) / 10000,
        divisor,
      };
    });
    updateField('components', mapped);
    updateField('customLines', customLines);

    const gstRate = state.product?.gst_rate || 18;
    updateField('rows', state.rows.map((r, i) =>
      i === 0
        ? {
            ...r,
            costPerPcs,
            rowAmount: Math.round(costPerPcs * r.totalPcs * 100) / 100,
            gstAmount: Math.round(costPerPcs * r.totalPcs * (gstRate / 100) * 100) / 100,
            rowTotal: Math.round(costPerPcs * r.totalPcs * (1 + gstRate / 100) * 100) / 100,
          }
        : r
    ));
  }, [components, customLines, bulkCost, costPerPcs]);

  // Label handling
  const labelCheckResult = state.labelCheckResult;
  const showLabelBanner = labelCheckResult && !labelCheckResult.sufficient && !NO_LABEL_TYPES.includes(packingType);

  const handleBatchConfirmed = (info) => {
    updateField('labelBatch', info);
    updateField('labelCheckResult', { ...labelCheckResult, sufficient: true });
    setComponents((prev) =>
      prev.map((c) => c.name === 'Label' ? { ...c, isChecked: true, appliedRate: info.rate } : c)
    );
  };

  const totalPcs = state.rows?.[0]?.totalPcs || 0;

  // Build division breakdown text for each component
  const getBreakdownText = (comp) => {
    if (comp.isBulk) {
      return `${state.packSizeValue}${state.packSizeUnit} × ₹${bulkRate}/${product?.rate_unit === 'kg' ? 'Kg' : 'Ltr'} = ₹${bulkCost.toFixed(2)}`;
    }
    const { divisor, label } = getDivisor(comp.name, packingType, packSize, nosPerCarton);
    if (divisor > 1 && label) {
      const cpp = (comp.appliedRate || 0) / divisor;
      return `₹${(comp.appliedRate || 0).toFixed(2)} ÷ ${label} = ₹${cpp.toFixed(4)}`;
    }
    return '';
  };

  const getCostPerPcsForComp = (comp) => {
    if (!comp.isChecked) return 0;
    if (comp.isBulk) return bulkCost;
    const { divisor } = getDivisor(comp.name, packingType, packSize, nosPerCarton);
    return Math.round(((comp.appliedRate || 0) / divisor) * 10000) / 10000;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-primary">Cost Component Builder</h2>
        <p className="text-sm text-text-secondary">
          {product?.product_name} — {packingType}, {packSize}
          {totalPcs > 0 && ` — ${totalPcs.toLocaleString('en-IN')} pcs`}
        </p>
      </div>

      {/* ── Label Banner / Batch UI ── */}
      {showLabelBanner && (
        <LabelBatchUI
          totalPcs={totalPcs}
          available={labelCheckResult?.available}
          productId={product?.id}
          packType={packingType}
          packSize={packSize}
          onConfirmed={handleBatchConfirmed}
        />
      )}

      {/* Green confirmation if batch was confirmed */}
      {state.labelBatch && !showLabelBanner && !NO_LABEL_TYPES.includes(packingType) && (
        <div className="mb-4 px-4 py-3 bg-success-light border border-success/30 rounded-lg flex items-center gap-2 text-success text-sm font-medium">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          Label batch of {state.labelBatch.quantity?.toLocaleString()} confirmed at ₹{state.labelBatch.rate}/label.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Component Table */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-3 py-2.5 text-xs font-semibold w-16">Include</th>
                  <th className="px-3 py-2.5 text-xs font-semibold text-left">Component</th>
                  <th className="px-3 py-2.5 text-xs font-semibold">Default Rate (₹)</th>
                  <th className="px-3 py-2.5 text-xs font-semibold">Applied Rate (₹)</th>
                  <th className="px-3 py-2.5 text-xs font-semibold">Cost / Pcs (₹)</th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp, i) => (
                  <ComponentCheckboxRow
                    key={comp.name}
                    componentName={comp.name}
                    variantLabel={comp.variantLabel}
                    isChecked={comp.isChecked}
                    canUncheck={comp.canUncheck}
                    defaultRate={comp.isBulk ? bulkCost : comp.defaultRate}
                    appliedRate={comp.isBulk ? bulkCost : comp.appliedRate}
                    costPerPcs={getCostPerPcsForComp(comp)}
                    isReadOnlyRate={comp.isBulk}
                    divisionBreakdown={comp.isChecked ? getBreakdownText(comp) : ''}
                    onCheckChange={(val) => updateComponent(i, 'isChecked', val)}
                    onRateChange={(val) => updateComponent(i, 'appliedRate', val)}
                  />
                ))}

                {/* Custom lines */}
                {customLines.map((cl, i) => (
                  <tr key={`custom-${i}`} className="border-b border-border bg-action-light/20">
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => removeCustomLine(i)} className="text-error hover:bg-error-light p-1 rounded">
                        <Trash2 size={14} />
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <input type="text" value={cl.name}
                        onChange={(e) => updateCustomLine(i, 'name', e.target.value)}
                        placeholder="Custom item name"
                        className="w-full px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-lighter"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs text-text-muted">—</td>
                    <td className="px-3 py-2.5 text-center">
                      <input type="number" step="0.01" min="0" value={cl.rate}
                        onChange={(e) => updateCustomLine(i, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1.5 border border-border rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary-lighter"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm font-semibold">₹{(cl.rate || 0).toFixed(2)}</td>
                  </tr>
                ))}

                {/* Running total footer */}
                <tr className="border-t-2 border-primary/20 bg-primary/5">
                  <td colSpan={4} className="px-3 py-3 font-bold text-primary text-sm">Cost Per Piece (Without GST)</td>
                  <td className="px-3 py-3 text-center font-bold text-xl text-primary">₹{costPerPcs.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button onClick={addCustomLine}
            className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
            <Plus size={16} /> Add Custom Line
          </button>
        </div>

        {/* Running Total Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-border rounded-xl p-5 sticky top-20">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">RUNNING TOTAL</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted">Cost Per Piece (₹)</p>
                <p className="text-3xl font-bold text-text-primary">{costPerPcs.toFixed(2)}</p>
              </div>
              <hr className="border-border" />
              {totalPcs > 0 && (
                <>
                  <div>
                    <p className="text-xs text-text-muted">× {totalPcs.toLocaleString('en-IN')} pcs</p>
                    <p className="text-lg font-bold text-text-primary">
                      ₹{(costPerPcs * totalPcs).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <hr className="border-border" />
                  <div>
                    <p className="text-xs text-text-muted">GST ({state.product?.gst_rate || 18}%)</p>
                    <p className="font-semibold text-text-secondary">
                      ₹{(costPerPcs * totalPcs * ((state.product?.gst_rate || 18) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <hr className="border-border" />
                  <div>
                    <p className="text-xs text-text-muted">Grand Total</p>
                    <p className="text-xl font-bold text-primary">
                      ₹{(costPerPcs * totalPcs * (1 + (state.product?.gst_rate || 18) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              )}
              <p className="text-xs text-text-muted">Cost per piece after division adjustments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
