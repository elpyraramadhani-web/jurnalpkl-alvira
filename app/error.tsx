"use client";

export default function Galat({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-8 text-center">
      <h1 className="mb-2 text-xl font-bold">Terjadi kesalahan</h1>
      <p className="mb-5 text-sm text-slate-600">Halaman gagal dimuat. Silakan coba lagi.</p>
      <button onClick={reset} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        Coba lagi
      </button>
    </div>
  );
}