import { ButtonProps } from "../types/types";

function Button({ text, onClick, outline, type = 'button' }: ButtonProps) {
  const baseClasses = "bg-black/20 backdrop-blur-lg text-white px-6 py-3 rounded-full cursor-pointer text-sm font-semibold font-inter uppercase tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap hover:bg-black/40 hover:scale-105 hover:border-2 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 border-2 border-transparent active:scale-95 active:bg-black/50 active:shadow-lg active:shadow-purple-500/40";
  const outlineClasses = outline ? "bg-black/20 backdrop-blur-lg text-white hover:bg-black/40 hover:scale-105 hover:border-2 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 border-2 border-transparent" : "bg-black/20 backdrop-blur-lg text-white hover:bg-black/40 hover:scale-105 hover:border-2 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 border-2 border-transparent";

  // Arrow icon component
  const ArrowIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 group-active:translate-x-0.5 group-active:-translate-y-0.5 group-active:scale-105"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17"/>
    </svg>
  );

  return (
    <button
      type={type}
      className={`${baseClasses} ${outlineClasses} group`}
      onClick={onClick}
    >
      {text}
      <ArrowIcon />
    </button>
  );
}

export default Button;
