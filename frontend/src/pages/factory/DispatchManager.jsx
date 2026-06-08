import { useState, useEffect } from 'react';
import { orderService } from '../../services/dataService';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LRUpload from './LRUpload';
import OrderDetailsModal from './OrderDetailsModal';
import Input from '../../components/common/Input';
import { Download, ChevronDown, Package, FileText, CheckCircle2, Truck, FileUp, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DispatchManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [dispatchNote, setDispatchNote] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [lrUrl, setLrUrl] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    // Fetch orders and filter only ready_to_dispatch and dispatched
    orderService.getAll()
      .then(({ data }) => {
        const allOrders = data.data || [];
        setOrders(allOrders.filter(o => o.current_status === 'ready_to_dispatch' || o.current_status === 'dispatched'));
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDispatch = (order) => {
    setSelectedOrder(order);
    setDispatchNote(order.dispatch_note || '');
    setLrUrl(order.lr_attachments?.[0]?.file_url || '');
    setDispatchModalOpen(true);
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to completely delete this dispatched order? This cannot be undone.')) {
      try {
        await orderService.delete(id);
        toast.success('Order deleted successfully.');
        fetchOrders();
      } catch {
        toast.error('Failed to delete order.');
      }
    }
  };

  const handleMarkAsDispatched = async () => {
    setDispatching(true);
    try {
      if (selectedOrder.current_status !== 'dispatched') {
        await orderService.updateStatus(selectedOrder.id, { status: 'dispatched', factory_notes: dispatchNote });
        toast.success('Order marked as dispatched!');
      } else if (dispatchNote !== selectedOrder.dispatch_note) {
        await orderService.updateStatus(selectedOrder.id, { status: 'dispatched', factory_notes: dispatchNote });
        toast.success('Dispatch details updated!');
      }
      setDispatchModalOpen(false);
      fetchOrders();
    } catch {
      // toast is handled
    } finally {
      setDispatching(false);
    }
  };

  const handleDeleteLR = async () => {
    if (!selectedOrder) return;
    if (window.confirm('Are you sure you want to permanently delete this LR document?')) {
      try {
        await orderService.deleteLR(selectedOrder.id);
        toast.success('LR Document deleted.');
        setLrUrl('');
        fetchOrders();
      } catch {
        // toast is handled
      }
    }
  };

  const columns = [
    { key: 'order_number', header: 'Order ID', accessor: (r) => r.id + ' ' + r.quotations?.customer_name + ' ' + r.quotations?.products?.product_name, render: (r) => (
      <button onClick={() => handleOpenDetails(r)} className="font-bold text-primary hover:underline text-left">
        {r.id.substring(r.id.length - 8).toUpperCase()}
      </button>
    )},
    { key: 'customer_name', header: 'Customer', accessor: (r) => r.quotations?.customer_name, render: (r) => r.quotations?.customer_name || '-' },
    { key: 'product', header: 'Product & Brand', render: (r) => {
      const rows = r.quotations?.quotation_rows || [];
      const productNames = Array.from(new Set(rows.map(row => row.products?.product_name).filter(Boolean)));
      return (
        <div>
          <p className="font-semibold text-text-primary">{productNames.length > 0 ? productNames.join(', ') : '-'}</p>
          <p className="text-xs text-text-muted">{r.quotations?.order_type === 'gujarat_brand' ? 'Volkschem' : (r.quotations?.name_on_label || r.quotations?.billing_name || '-')}</p>
        </div>
      );
    }},
    { key: 'cases', header: 'Total Cases', render: (r) => {
      const cases = r.quotations?.quotation_rows?.reduce((acc, row) => acc + (row.total_cases || 0), 0);
      return <span className="font-semibold">{cases || '-'}</span>;
    }},
    { key: 'total_volume', header: 'Total Volume', render: (r) => {
      const rows = r.quotations?.quotation_rows || [];
      let displayUnit = 'Ltr/Kg';
      if (rows.length > 0) {
        const u = (rows[0].pack_size_unit || '').toLowerCase().trim();
        if (u === 'ml' || u === 'ltr') displayUnit = 'Ltr';
        else if (u === 'gm' || u === 'kg') displayUnit = 'Kg';
      }

      const totalVolume = rows.reduce((sum, row) => {
        let vol = Number(row.total_ltr_kg) || 0;
        if (!vol && row.pack_size_value && row.total_pcs) {
          const unit = (row.pack_size_unit || '').toLowerCase().trim();
          let multiplier = 1;
          if (unit === 'ml' || unit === 'gm') multiplier = 0.001;
          vol = row.pack_size_value * multiplier * row.total_pcs;
        }
        return sum + vol;
      }, 0);
      return <span className="font-semibold text-primary">{totalVolume.toFixed(2)} {displayUnit}</span>;
    }},
    { key: 'destination', header: 'Destination / Transport', render: (r) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{r.quotations?.destination || '-'}</span>
        <span className="text-xs text-text-muted">{r.quotations?.transport_name || 'N/A'}</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (r) => {
      const hasLR = r.lr_attachments && r.lr_attachments.length > 0;
      return (
        <div className="flex flex-col gap-1 items-start">
          <Badge status={r.current_status} />
          {r.current_status === 'dispatched' && (
            hasLR ? (
              <span className="text-xs text-success font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> LR Attached
              </span>
            ) : (
              <span className="text-xs text-warning-dark font-medium flex items-center gap-1">
                <Clock size={12} /> LR Pending
              </span>
            )
          )}
        </div>
      );
    }},
    { key: 'actions', header: 'Action', sortable: false, render: (r) => {
      const hasLR = r.lr_attachments && r.lr_attachments.length > 0;
      return (
        <div className="flex flex-col gap-1 items-end">
          <Button 
            variant={r.current_status === 'dispatched' ? (hasLR ? 'ghost' : 'secondary') : 'primary'} 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); handleOpenDispatch(r); }}
            className="w-full justify-between whitespace-nowrap"
          >
            {r.current_status === 'dispatched' ? (hasLR ? 'View/Edit LR' : 'Upload LR') : 'Mark Dispatched'} 
            {r.current_status !== 'dispatched' && <Truck size={14} />}
          </Button>
        <button 
          onClick={(e) => handleDelete(e, r.id)}
          className="text-error/80 hover:text-error hover:bg-error/10 p-1.5 rounded transition-colors mt-1"
          title="Delete Order"
        >
          <Trash2 size={16} />
        </button>
      </div>
      );
    }},
  ];

  const summaryCounts = {
    ready: orders.filter(o => o.current_status === 'ready_to_dispatch').length,
    dispatched: orders.filter(o => o.current_status === 'dispatched').length,
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-text-primary">Dispatch Management</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage ready orders and upload LR documents</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-warning-light text-warning-dark p-2 rounded-lg"><Package size={20} /></div>
            <div>
              <p className="text-xs text-text-muted font-medium">Ready to Dispatch</p>
              <p className="text-xl font-bold text-text-primary">{summaryCounts.ready}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-success-light text-success-dark p-2 rounded-lg"><Truck size={20} /></div>
            <div>
              <p className="text-xs text-text-muted font-medium">Dispatched</p>
              <p className="text-xl font-bold text-text-primary">{summaryCounts.dispatched}</p>
            </div>
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={orders} 
        loading={loading} 
        searchPlaceholder="Search by Order ID, Product or Customer..." 
      />

      {/* Dispatch Modal */}
      <Modal 
        isOpen={dispatchModalOpen} 
        onClose={() => setDispatchModalOpen(false)} 
        title={`Dispatch Order: ${selectedOrder?.id?.substring(selectedOrder?.id?.length - 8).toUpperCase()}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-surface-alt p-3 rounded-lg border border-border flex items-center justify-between">
            <span className="text-sm text-text-secondary">Current Status:</span>
            <span className="text-sm font-bold capitalize">{selectedOrder?.current_status?.replace(/_/g, ' ')}</span>
          </div>

          <Input 
            label="Dispatch Details (LR No, Transport Info)" 
            type="textarea" 
            rows={3} 
            value={dispatchNote} 
            onChange={(e) => setDispatchNote(e.target.value)} 
            placeholder="E.g. LR No: 123456, Transport: VRL Logistics"
          />

          {!lrUrl && (
            <LRUpload 
              orderId={selectedOrder?.id} 
              onSuccess={(url) => {
                setLrUrl(url);
                // if we wanted to auto-update status when LR is uploaded, we could, 
                // but we let user click save to commit everything.
              }} 
            />
          )}

          {lrUrl && (
            <div className="mt-4 p-3 bg-success-light border border-success/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-success font-medium flex items-center gap-1">
                <CheckCircle2 size={16} /> LR Document Attached
              </span>
              <div className="flex items-center gap-4">
                <a href={lrUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-success hover:underline font-bold">View LR</a>
                <button onClick={handleDeleteLR} className="text-sm text-error hover:underline flex items-center gap-1"><Trash2 size={14}/> Remove</button>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDispatchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleMarkAsDispatched} loading={dispatching}>
              {selectedOrder?.current_status === 'dispatched' ? 'Save Changes' : 'Confirm Dispatch'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Order Details: ${selectedOrder?.id?.substring(selectedOrder?.id?.length - 8).toUpperCase()}`}
        size="lg"
      >
        <OrderDetailsModal order={selectedOrder} />
      </Modal>
    </div>
  );
}
