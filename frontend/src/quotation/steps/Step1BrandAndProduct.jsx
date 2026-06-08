import { useState, useEffect } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import { productService } from '../../services/dataService';
import { ShieldCheck, Building2, Search, Loader2 } from 'lucide-react';

const brandTypes = [
  { value: 'gujarat_brand', label: 'Gujarat Brand Product', desc: "Volkschem's own manufactured and branded products", icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary' },
  { value: 'third_party',  label: 'Third Party Manufacturing', desc: "Custom manufacturing for client's brand", icon: Building2, color: 'text-action', bg: 'bg-action-light', border: 'border-action' },
];

export default function Step1BrandAndProduct() {
  const { state, updateField } = useQuotation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Fetch products when brand type changes
  useEffect(() => {
    if (!state.orderType) return;
    setLoading(true);
    productService.getAll({ order_type: state.orderType })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [state.orderType]);

  const handleBrandSelect = (val) => {
    if (val !== state.orderType) {
      updateField('orderType', val);
      updateField('product', null);
      updateField('productBulkRate', 0);
      updateField('rateUnit', '');
    }
  };

  const handleProductSelect = (product) => {
    updateField('product', product);
    // FIX 1: Store bulk rate from the correct field name
    updateField('productBulkRate', product.bulk_rate_per_ltr_kg || 0);
    updateField('rateUnit', product.rate_unit || 'ltr');
  };

  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(query.toLowerCase()) ||
    p.technical_combination?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Section 1: Brand Type Cards */}
      <h2 className="text-xl font-bold text-text-primary mb-2">Select Brand Type & Product</h2>
      <p className="text-sm text-text-secondary mb-6">Choose the brand type, then select a product for this quotation</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {brandTypes.map((t) => {
          const isSelected = state.orderType === t.value;
          return (
            <button
              key={t.value}
              onClick={() => handleBrandSelect(t.value)}
              className={`relative flex flex-col items-center p-7 rounded-2xl border-2 transition-all duration-200 text-center ${
                isSelected ? `${t.border} ${t.bg} shadow-md` : 'border-border bg-white hover:border-primary-lighter hover:shadow-card'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
              )}
              <div className={`w-14 h-14 rounded-xl ${t.bg} flex items-center justify-center mb-3`}>
                <t.icon size={28} className={t.color} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">{t.label}</h3>
              <p className="text-xs text-text-secondary">{t.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Section 2: Product Search & List (appears after brand type selected) */}
      {state.orderType && (
        <div className="animate-fade-in">
          <div className="border-t border-border pt-6 mb-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Select Product</h3>
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product name or technical..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 size={24} className="text-primary animate-spin" /></div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProductSelect(p)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all ${
                    state.product?.id === p.id ? 'border-primary bg-primary-50' : 'border-border bg-white hover:border-primary-lighter'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-text-primary">{p.product_name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{p.technical_combination}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-bold text-primary">₹{p.bulk_rate_per_ltr_kg?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-text-muted">per {p.rate_unit === 'kg' ? 'Kg' : 'Ltr'}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center text-text-muted py-6">No products found</p>}
            </div>
          )}

          {/* Selected Product Summary */}
          {state.product && (
            <div className="mt-5 p-4 bg-primary-50 border border-primary/20 rounded-xl">
              <p className="text-xs text-text-muted mb-1">Selected Product</p>
              <p className="font-bold text-primary">{state.product.product_name}</p>
              <p className="text-sm text-text-secondary">{state.product.technical_combination}</p>
              <p className="text-sm font-semibold text-primary mt-1">
                Bulk Rate: ₹{state.product.bulk_rate_per_ltr_kg?.toLocaleString('en-IN')} / {state.product.rate_unit === 'kg' ? 'Kg' : 'Ltr'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
