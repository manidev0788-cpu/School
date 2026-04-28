export function Card({ children, className = "", interactive = false, ...props }) {
  const interactiveCls = interactive
    ? "duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgb(15,23,42,0.15)] active:translate-y-0"
    : "";

  return (
    <div
      className={`rounded-2xl bg-white shadow-[0_8px_30px_rgb(15,23,42,0.05)] ring-1 ring-slate-200/70 transition-[box-shadow,transform] duration-300 hover:shadow-[0_14px_44px_rgb(15,23,42,0.08)] ${interactiveCls} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
