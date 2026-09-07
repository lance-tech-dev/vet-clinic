import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export function Logo({ onClick, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex items-center group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 rounded-lg py-1 transition-opacity hover:opacity-90 ${className}`}
      aria-label="VetClinic Furbabies & Friends - Return to homepage"
    >
      <Image
        src="/vetclinic-logo.png"
        alt="VetClinic Furbabies & Friends Logo"
        width={1956}
        height={804}
        priority
        className="h-10 sm:h-11 lg:h-12 w-auto object-contain"
      />
    </Link>
  );
}