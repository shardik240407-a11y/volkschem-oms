const statusConfig = {
  draft:              { label: 'Draft',              bg: 'bg-status-draft-bg',          text: 'text-status-draft',          dot: 'bg-status-draft' },
  pending:            { label: 'Pending',            bg: 'bg-status-pending-bg',        text: 'text-status-pending',        dot: 'bg-status-pending' },
  approved:           { label: 'Approved',           bg: 'bg-status-approved-bg',       text: 'text-status-approved',       dot: 'bg-status-approved' },
  rejected:           { label: 'Rejected',           bg: 'bg-status-rejected-bg',       text: 'text-status-rejected',       dot: 'bg-status-rejected' },
  confirmed:          { label: 'Confirmed',          bg: 'bg-status-confirmed-bg',      text: 'text-status-confirmed',      dot: 'bg-status-confirmed' },
  in_production:      { label: 'In Production',      bg: 'bg-status-in-production-bg',  text: 'text-status-in-production',  dot: 'bg-status-in-production' },
  quality_check:      { label: 'Quality Check',      bg: 'bg-[#F3E5F5]',               text: 'text-[#7B1FA2]',             dot: 'bg-[#7B1FA2]' },
  ready_to_dispatch:  { label: 'Ready to Dispatch',  bg: 'bg-status-ready-bg',          text: 'text-status-ready',          dot: 'bg-status-ready' },
  dispatched:         { label: 'Dispatched',         bg: 'bg-status-dispatched-bg',     text: 'text-status-dispatched',     dot: 'bg-status-dispatched' },
  active:             { label: 'Active',             bg: 'bg-success-light',            text: 'text-success',               dot: 'bg-success' },
  inactive:           { label: 'Inactive',           bg: 'bg-error-light',              text: 'text-error',                 dot: 'bg-error' },
  gujarat_brand:      { label: 'Gujarat Brand',      bg: 'bg-primary-50',               text: 'text-primary',               dot: 'bg-primary' },
  third_party:        { label: 'Third Party',        bg: 'bg-surface-alt',              text: 'text-text-secondary',        dot: 'bg-text-secondary' },
  admin:              { label: 'Admin',              bg: 'bg-primary-100',              text: 'text-primary',               dot: 'bg-primary' },
  employee:           { label: 'Employee',           bg: 'bg-info-light',               text: 'text-info',                  dot: 'bg-info' },
  factory_admin:      { label: 'Factory Admin',      bg: 'bg-action-light',             text: 'text-action',                dot: 'bg-action' },
};

export default function Badge({ status, className = '' }) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-xs font-semibold whitespace-nowrap
        ${config.bg} ${config.text}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
