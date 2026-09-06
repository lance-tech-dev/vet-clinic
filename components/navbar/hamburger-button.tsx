interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({
  isOpen,
  onClick,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-navy-900 hover:bg-navy-50 active:bg-navy-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 transition-colors ${className}`}
      aria-controls="mobile-drawer"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <div className="w-5 h-4 relative flex flex-col justify-between" aria-hidden="true">
        <span
          className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-250 ease-out origin-center ${
            isOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-200 ease-out ${
            isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
          }`}
        />
        <span
          className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-250 ease-out origin-center ${
            isOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </div>
    </button>
  );
}
