// src/components/Unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-slate-600">You don't have permission to access this page.</p>
        <a href="/my-todo" className="mt-4 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-white">
          Go Back Home
        </a>
      </div>
    </div>
  );
}