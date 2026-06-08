import { useState } from 'react';
import { orderService } from '../../services/dataService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LRUpload from './LRUpload';
import toast from 'react-hot-toast';

const STATUS_FLOW = {
  confirmed: ['in_production'],
  in_production: ['quality_check'],
  quality_check: ['packing'],
  packing: ['ready_to_dispatch'],
  ready_to_dispatch: ['dispatched'],
};

const STATUS_LABELS = {
  in_production: 'In Production',
  quality_check: 'Quality Check',
  packing: 'Packing',
  ready_to_dispatch: 'Ready to Dispatch',
  dispatched: 'Dispatched',
};

export default function ProgressUpdater({ order, onUpdate, onCancel }) {
  const currentStatus = order?.current_status;
  const nextValidStatuses = STATUS_FLOW[currentStatus] || [];
  
  const [status, setStatus] = useState(nextValidStatuses.length === 1 ? nextValidStatuses[0] : '');
  const [notes, setNotes] = useState(order?.factory_notes || '');
  const [saving, setSaving] = useState(false);
  const [lrUrl, setLrUrl] = useState(order?.lr_document_url || '');

  const handleUpdate = async () => {
    if (!status) { toast.error('Please select a new status.'); return; }
    
    // If dispatched, we could enforce LR upload here, but LR can also be uploaded separately
    setSaving(true);
    try {
      await orderService.updateStatus(order.id, { status, factory_notes: notes });
      toast.success('Order status updated!');
      onUpdate();
    } catch {
      // toast handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-alt p-3 rounded-lg border border-border flex items-center justify-between">
        <span className="text-sm text-text-secondary">Current Status:</span>
        <span className="text-sm font-bold capitalize">{currentStatus?.replace(/_/g, ' ')}</span>
      </div>

      {nextValidStatuses.length > 0 ? (
        <>
          <Input 
            label="Update Status To" 
            type="select" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            options={[{ value: '', label: 'Select new status...' }].concat(
              nextValidStatuses.map(s => ({ value: s, label: STATUS_LABELS[s] || s }))
            )}
            required
          />

          <Input 
            label="Factory Notes (Optional)" 
            type="textarea" 
            rows={2} 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Any specific notes for production/dispatch..."
          />

          {status === 'dispatched' && !lrUrl && (
            <LRUpload orderId={order.id} onSuccess={(url) => setLrUrl(url)} />
          )}

          {lrUrl && (
            <div className="mt-4 p-3 bg-success-light border border-success/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-success font-medium">LR Document Uploaded</span>
              <a href={lrUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-success hover:underline font-bold">View LR</a>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate} loading={saving}>Save Update</Button>
          </div>
        </>
      ) : (
        <div className="py-4 text-center">
          <p className="text-sm text-text-secondary">This order has reached its final status and cannot be updated further.</p>
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={onCancel}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
