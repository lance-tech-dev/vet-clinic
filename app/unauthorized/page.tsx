import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function UnauthorizedPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-full max-w-md p-8 bg-surface rounded-2xl shadow-md border border-border space-y-4">
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Access Denied</h1>
        <p className="text-sm text-foreground-muted">
          Your account is signed in, but you do not have administrative privileges to access this area.
        </p>
        <div className="pt-2">
          <Link
            href={ROUTES.HOME}
            className="inline-block w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm cursor-pointer"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}