import { useQuotation } from '../../context/QuotationContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import { useEffect } from 'react';

export default function Step2CustomerDetails() {
  const { state, updateHeader } = useQuotation();
  const { user } = useAuth();
  const h = state.header;

  // Auto-fill employee name on mount
  useEffect(() => {
    if (!h.employee_name && user?.full_name) {
      updateHeader('employee_name', user.full_name);
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-xl font-bold text-text-primary mb-2">Customer & Order Details</h2>
      <p className="text-sm text-text-secondary mb-6">Enter customer information and delivery details</p>

      <div className="space-y-5">
        {/* Company Name */}
        {state.orderType === 'gujarat_brand' ? (
          <div className="p-3 bg-surface-alt border border-border rounded-lg">
            <p className="text-xs text-text-muted">Company Name</p>
            <p className="text-sm font-semibold text-text-primary">Volkschem Crop Science Pvt. Ltd.</p>
          </div>
        ) : (
          <Input
            label="Company / Billing Name"
            value={h.billing_name}
            onChange={(e) => updateHeader('billing_name', e.target.value)}
            placeholder="Enter client company name"
            required
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Employee Name" value={h.employee_name} onChange={(e) => updateHeader('employee_name', e.target.value)} required />
          <Input label="Customer Name" value={h.customer_name} onChange={(e) => updateHeader('customer_name', e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Customer Contact" value={h.customer_contact} onChange={(e) => updateHeader('customer_contact', e.target.value)} placeholder="+91 XXXXX XXXXX" />
          <Input label="GST / PAN Number" value={h.gst_pan} onChange={(e) => updateHeader('gst_pan', e.target.value)} placeholder="e.g. 24AAFCV2675N1ZU" />
        </div>

        <Input label="Billing Address" type="textarea" rows={2} value={h.billing_address} onChange={(e) => updateHeader('billing_address', e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.orderType === 'gujarat_brand' && (
            <Input label="Billing Name" value={h.billing_name} onChange={(e) => updateHeader('billing_name', e.target.value)} />
          )}
          <Input label="Transport Name" value={h.transport_name} onChange={(e) => updateHeader('transport_name', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Delivery Destination" value={h.destination} onChange={(e) => updateHeader('destination', e.target.value)} />
          <Input label="Pin Code" value={h.pin_code} onChange={(e) => updateHeader('pin_code', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Label Company Name" value={h.label_company_name} onChange={(e) => updateHeader('label_company_name', e.target.value)} />
          <Input label="Name on Label" value={h.name_on_label} onChange={(e) => updateHeader('name_on_label', e.target.value)} />
        </div>

        <Input label="Quotation Date" type="date" value={h.quotation_date} onChange={(e) => updateHeader('quotation_date', e.target.value)} />
      </div>
    </div>
  );
}
