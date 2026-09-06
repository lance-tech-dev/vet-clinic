export default function AdminUnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-900">Access Denied</h1>
        <p className="mt-2 text-navy-700">
          Your account is signed in but does not have administrative privileges.
        </p>
      </div>
    </main>
  );
}
