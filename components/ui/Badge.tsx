interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline';
}

export default function Badge({ label, color = 'var(--orange)', variant = 'filled' }: BadgeProps) {
  const isFilled = variant === 'filled';
  
  return (
    <span 
      className="inline-block uppercase tracking-wider text-[10px] font-extrabold px-2 py-1 rounded-sm"
      style={{
        backgroundColor: isFilled ? color : 'transparent',
        color: isFilled ? 'white' : color,
        border: isFilled ? 'none' : `1px solid ${color}`
      }}
    >
      {label}
    </span>
  );
}
