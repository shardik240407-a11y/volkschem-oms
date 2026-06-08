import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { labelService } from '../../services/dataService';
import toast from 'react-hot-toast';

export default function LabelInventoryWarning({ productName, packSize, stockAvailable, required, onBatchAdded }) {
  const shortfall = required - stockAvailable;
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totalCost = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);

  const handleAdd = async () => {
    if (!quantity || parseInt(quantity) < 1000) {
      setError('Minimum batch quantity is 1,000 labels.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await labelService.addBatch({
        product_name: productName,
        pack_size: packSize,
        quantity: parseInt(quantity),
        rate_per_label: parseFloat(rate) || 0,
      });
      toast.success('Label batch added successfully!');
      onBatchAdded?.({
        open_stock: stockAvailable,
        make: parseInt(quantity),
        total_stock: stockAvailable + parseInt(quantity),
        used: required,
        closing_stock: stockAvailable + parseInt(quantity) - required,
        rate: parseFloat(rate) || 0,
        amount: required * (parseFloat(rate) || 0),
        gst: required * (parseFloat(rate) || 0) * 0.18,
        total_with_gst: required * (parseFloat(rate) || 0) * 1.18,
      });
    } catch { /* handled */ }
    finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-error-light border border-error/30 rounded-xl">
        <AlertTriangle size={22} className="text-error flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-error">Insufficient Labels — Only {stockAvailable} Remaining</p>
          <p className="text-sm text-error/80 mt-1">
            This order requires <strong>{required}</strong> labels for {productName} {packSize}.
            Shortfall: <strong>{shortfall}</strong> labels.
          </p>
        </div>
      </div>

      {/* Add Batch Form */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="text-base font-bold text-text-primary mb-4">Add New Label Batch</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input label="Quantity to Add" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
              placeholder="Min 1,000" error={error} required />
          </div>
          <div>
            <Input label="Rate Per Label (₹)" type="number" step="0.01" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 0.95" required />
          </div>
        </div>
        {totalCost > 0 && (
          <p className="text-sm text-text-secondary mt-3">
            Total Label Cost: <span className="font-bold text-primary">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </p>
        )}
        <div className="mt-4">
          <Button onClick={handleAdd} loading={saving} variant="primary">Confirm Add Batch</Button>
        </div>
      </div>
    </div>
  );
}
