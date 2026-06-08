import { useState, useEffect } from 'react';
import { bulkPriceService } from '../../services/dataService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkPriceSection() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ material_name: '', rate_per_unit: '', unit: 'ltr' });

  const fetchMaterials = () => {
    setLoading(true);
    bulkPriceService.getAll()
      .then(({ data }) => setMaterials(data.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMaterials(); }, []);

  const openAdd = () => { setEditing(null); setForm({ material_name: '', rate_per_unit: '', unit: 'ltr' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm({ material_name: item.material_name, rate_per_unit: item.rate_per_unit, unit: item.unit || 'ltr' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.material_name.trim()) { toast.error('Material name is required.'); return; }
    if (!form.rate_per_unit || isNaN(form.rate_per_unit)) { toast.error('Valid rate is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, rate_per_unit: parseFloat(form.rate_per_unit) };
      if (editing) {
        await bulkPriceService.update(editing.id, payload);
        toast.success('Material updated.');
      } else {
        await bulkPriceService.create(payload);
        toast.success('Material added.');
      }
      setModalOpen(false);
      fetchMaterials();
    } catch { /* handled */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    try {
      await bulkPriceService.remove(id);
      toast.success('Material deleted.');
      fetchMaterials();
    } catch { /* handled */ }
  };

  const columns = [
    { key: 'material_name', header: 'Material Name', accessor: 'material_name' },
    { key: 'rate_per_unit', header: 'Rate (₹ / Kg or Ltr)', render: (r) => <span className="font-semibold">₹ {r.rate_per_unit?.toLocaleString('en-IN')}</span> },
    { key: 'unit', header: 'Unit', render: (r) => <span className="capitalize">{r.unit || '-'}</span> },
    { key: 'updated_at', header: 'Last Updated', render: (r) => r.updated_at ? new Date(r.updated_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-' },
    { key: 'updated_by', header: 'Updated By', render: (r) => r.updated_by_name || '-' },
    { key: 'actions', header: 'Actions', sortable: false, render: (r) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="p-1.5 hover:bg-surface-alt rounded-md text-text-secondary hover:text-primary transition-colors"><Pencil size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 hover:bg-error-light rounded-md text-text-secondary hover:text-error transition-colors"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bulk Material Prices</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage per-litre / per-kg raw material rates</p>
        </div>
        <Button variant="warning" icon={Plus} onClick={openAdd}>Add Material</Button>
      </div>

      <Table columns={columns} data={materials} loading={loading} searchPlaceholder="Search material..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Material' : 'Add Material'}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button></>}
      >
        <div className="space-y-4">
          <Input label="Material Name" value={form.material_name} onChange={(e) => setForm({ ...form, material_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Rate (₹)" type="number" value={form.rate_per_unit} onChange={(e) => setForm({ ...form, rate_per_unit: e.target.value })} required />
            <Input label="Unit" type="select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} options={[{ value: 'ltr', label: 'Litre' }, { value: 'kg', label: 'Kg' }]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
