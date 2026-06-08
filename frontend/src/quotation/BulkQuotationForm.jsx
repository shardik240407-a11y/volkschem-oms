import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bulkPriceService, quotationService } from '../services/dataService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Search, Save, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function formatINR(a) { return a == null ? '₹0' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(a); }

export default function BulkQuotationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [form, setForm] = useState({
    customer_name: '', customer_contact: '', billing_address: '',
    transport_name: '', destination: '', quotation_date: new Date().toISOString().split('T')[0],
    notes: '', quantity: '', gst_rate: '18',
  });

  useEffect(() => {
    let isMounted = true;
    bulkPriceService.getAll()
      .then(async ({ data }) => {
        const mats = data.data || [];
        if (isMounted) setMaterials(mats);
        
        if (editId) {
          try {
            const res = await quotationService.getById(editId);
            const q = res.data.data;
              if (q && isMounted) {
              setForm({
                customer_name: q.customer_name || '',
                customer_contact: q.customer_contact || '',
                billing_address: q.billing_address || '',
                transport_name: q.transport_name || '',
                destination: q.destination || '',
                quotation_date: q.quotation_date || new Date().toISOString().split('T')[0],
                notes: q.notes || '',
                quantity: q.quantity || q.rows?.[0]?.total_quantity_ltr_kg || '',
                gst_rate: q.gst_rate?.toString() || q.rows?.[0]?.gst_rate?.toString() || '18',
              });
              const mat = mats.find(m => m.material_name === q.material_name || m.material_name === q.rows?.[0]?.packing_type);
              if (mat) setSelectedMaterial(mat);
            }
          } catch (e) {
            toast.error('Failed to load quotation');
          }
        }
      })
      .catch(() => { if (isMounted) setMaterials([]); })
      .finally(() => { if (isMounted) setLoading(false); });
      
    return () => { isMounted = false; };
  }, [editId]);

  const filtered = materials.filter((m) => m.material_name?.toLowerCase().includes(query.toLowerCase()));
  const qty = parseFloat(form.quantity) || 0;
  const rate = selectedMaterial?.rate_per_unit || 0;
  const amount = qty * rate;
  const gstRate = parseInt(form.gst_rate) || 18;
  const gstAmount = amount * (gstRate / 100);
  const grandTotal = amount + gstAmount;

  const handleSubmit = async (status) => {
    if (!selectedMaterial) { toast.error('Select a material.'); return; }
    if (!form.customer_name) { toast.error('Customer name is required.'); return; }
    if (!form.quantity || qty <= 0) { toast.error('Enter valid quantity.'); return; }
    setSaving(true);
    try {
      const payload = {
        order_type: 'bulk',
        status,
        employee_name: user?.full_name,
        customer_name: form.customer_name,
        customer_contact: form.customer_contact,
        billing_address: form.billing_address,
        transport_name: form.transport_name,
        destination: form.destination,
        quotation_date: form.quotation_date,
        notes: form.notes,
        material_name: selectedMaterial.material_name,
        material_rate: rate,
        material_unit: selectedMaterial.unit,
        quantity: qty,
        subtotal: amount,
        total_gst: gstAmount,
        grand_total: grandTotal,
        gst_rate: gstRate,
      };

      if (editId) {
        await quotationService.update(editId, payload);
      } else {
        await quotationService.create(payload);
      }
      toast.success(status === 'draft' ? 'Saved as draft.' : 'Submitted for approval!');
      navigate('/employee/my-orders');
    } catch { /* handled */ }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Bulk Material Quotation</h1>
      <p className="text-sm text-text-secondary mb-6">Simple rate × quantity quotation for raw materials</p>

      {/* Material Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-text-primary mb-2 block">Select Material <span className="text-error">*</span></label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bulk material..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter" />
        </div>
        {query && (
          <div className="mt-1 max-h-40 overflow-y-auto border border-border rounded-lg bg-white shadow-card">
            {loading ? <div className="p-3 flex justify-center"><Loader2 size={18} className="animate-spin text-primary" /></div> :
              filtered.map((m) => (
                <button key={m.id} onClick={() => { setSelectedMaterial(m); setQuery(''); }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 flex justify-between">
                  <span>{m.material_name}</span>
                  <span className="font-semibold text-primary">₹{m.rate_per_unit?.toLocaleString('en-IN')} / {m.unit === 'kg' ? 'Kg' : 'Ltr'}</span>
                </button>
              ))}
          </div>
        )}
        {selectedMaterial && (
          <div className="mt-2 p-3 bg-primary-50 border border-primary/20 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-primary">{selectedMaterial.material_name}</span>
            <span className="text-sm font-bold text-primary">₹{rate?.toLocaleString('en-IN')} / {selectedMaterial.unit === 'kg' ? 'Kg' : 'Ltr'}</span>
          </div>
        )}
      </div>

      {/* Customer Details */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Customer Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
          <Input label="Contact" value={form.customer_contact} onChange={(e) => setForm({ ...form, customer_contact: e.target.value })} />
        </div>
        <Input label="Billing Address" type="textarea" rows={2} value={form.billing_address} onChange={(e) => setForm({ ...form, billing_address: e.target.value })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Transport Name" value={form.transport_name} onChange={(e) => setForm({ ...form, transport_name: e.target.value })} />
          <Input label="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Date" type="date" value={form.quotation_date} onChange={(e) => setForm({ ...form, quotation_date: e.target.value })} />
          <Input label="Quantity (Ltr/Kg)" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          <Input label="GST Rate" type="select" value={form.gst_rate} onChange={(e) => setForm({ ...form, gst_rate: e.target.value })}
            options={[{ value: '5', label: '5%' }, { value: '18', label: '18%' }]} />
        </div>
        <Input label="Notes" type="textarea" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      {/* Totals */}
      {selectedMaterial && qty > 0 && (
        <div className="p-5 bg-primary-50 border border-primary/20 rounded-xl mb-6">
          <div className="flex justify-between text-sm mb-1"><span>Amount ({qty} × ₹{rate}):</span><span className="font-semibold">{formatINR(amount)}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>GST ({gstRate}%):</span><span className="font-semibold">{formatINR(gstAmount)}</span></div>
          <hr className="border-primary/20 my-2" />
          <div className="flex justify-between text-lg font-bold text-primary"><span>Grand Total:</span><span>{formatINR(grandTotal)}</span></div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button variant="secondary" icon={Save} onClick={() => handleSubmit('draft')} loading={saving}>Save Draft</Button>
        <Button variant="warning" icon={Send} onClick={() => handleSubmit('pending')} loading={saving}>Submit to Admin</Button>
      </div>
    </div>
  );
}
