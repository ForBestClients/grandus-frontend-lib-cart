// Selectable card for delivery, payment and service rows: 12px radius,
// #E3EEED border; selected = brand border with a light brand-soft fill.
const OptionCard = ({
  selected = false,
  disabled = false,
  className = '',
  children,
}) => {
  const state = selected
    ? 'border-brand bg-brand-soft/40'
    : 'border-line-card bg-white hover:border-brand/60';

  return (
    <div
      className={`rounded-input border transition-colors duration-150 ${state} ${
        disabled ? 'pointer-events-none opacity-60' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default OptionCard;
