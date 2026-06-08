import { useState, useEffect, useMemo } from 'react';
import { bulkPriceService } from '../../services/dataService';
import { Search, Loader2 } from 'lucide-react';

export default function BulkPriceSearch() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    bulkPriceService.getAll()
      .then(({ data }) => setMaterials(data.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return materials;
    return materials.filter((m) => m.material_name?.toLowerCase().includes(query.toLowerCase()));
  }, [materials, query]);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Search Bulk Prices</h1>
        <p className="text-sm text-text-secondary mt-1">Look up per-litre / per-kg raw material rates</p>
      </div>

      {/* Large Search Input */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type material name..."
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter transition-colors shadow-card"
          autoFocus
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={28} className="text-primary animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {results.map((m) => (
            <div key={m.id} className="bg-white rounded-lg border border-border p-4 flex items-center justify-between hover:shadow-card transition-shadow">
              <div>
                <p className="text-sm font-semibold text-text-primary">{m.material_name}</p>
                <p className="text-xs text-text-muted capitalize">{m.unit || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹ {m.rate_per_unit?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-text-muted">per {m.unit === 'kg' ? 'Kg' : 'Ltr'}</p>
              </div>
            </div>
          ))}
          {results.length === 0 && <p className="text-center text-text-muted py-8">No materials found</p>}
        </div>
      )}
    </div>
  );
}
