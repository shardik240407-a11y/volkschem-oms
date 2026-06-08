import { useState, useEffect } from 'react';
import { adminService } from '../../services/dataService';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [usernameFilter, setUsernameFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [dateRange, setDateRange] = useState(''); // Just a simple string for now or 'today', 'week', etc.

  const fetchLogs = () => {
    setLoading(true);
    const params = {};
    if (usernameFilter) params.username = usernameFilter;
    if (resultFilter) params.result = resultFilter;
    if (dateRange) params.date = dateRange;
    
    adminService.getLoginLogs(params)
      .then(({ data }) => setLogs(data.data || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [usernameFilter, resultFilter, dateRange]);

  const columns = [
    { key: 'username', header: 'Username', render: (r) => r.username_attempted || '-' },
    { key: 'role', header: 'Role', render: (r) => r.users?.role ? <Badge status={r.users.role} /> : '-' },
    { key: 'login_time', header: 'Timestamp', render: (r) => r.created_at ? format(new Date(r.created_at), 'dd MMM yyyy, HH:mm:ss') : '-' },
    { key: 'ip_address', header: 'IP Address', render: (r) => r.ip_address || '-' },
    { key: 'status', header: 'Result', render: (r) => (
      <div className="flex flex-col gap-1 items-start">
        <Badge status={r.success ? 'active' : 'inactive'} />
        {!r.success && r.failure_reason && <span className="text-xs text-error">{r.failure_reason}</span>}
      </div>
    ) },
  ];

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to permanently delete all login logs?')) return;
    try {
      await adminService.clearLoginLogs();
      toast.success('All login logs cleared successfully.');
      fetchLogs();
    } catch {
      toast.error('Failed to clear login logs.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Login Logs</h1>
          <p className="text-sm text-text-secondary mt-0.5">Audit trail of system access</p>
        </div>
        <Button variant="danger" icon={Trash2} onClick={handleClearLogs}>Clear All Logs</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input 
          placeholder="Filter by Username" 
          value={usernameFilter} 
          onChange={(e) => setUsernameFilter(e.target.value)} 
          className="w-48"
        />
        <select 
          value={resultFilter} 
          onChange={(e) => setResultFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-lighter/40"
        >
          <option value="">All Results</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-lighter/40"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
        </select>
      </div>

      <Table 
        columns={columns} 
        data={logs} 
        loading={loading} 
        searchable={false}
      />
    </div>
  );
}
