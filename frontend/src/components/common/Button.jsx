import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary hover:bg-primary-light text-white shadow-sm',
  secondary: 'bg-white border border-border text-text-primary hover:bg-surface-alt shadow-sm',
  danger: 'bg-error hover:bg-red-700 text-white shadow-sm',
  warning: 'bg-action hover:bg-action-hover text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-surface-alt text-text-secondary',
  success: 'bg-success hover:bg-green-700 text-white shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
    </button>
  );
}
