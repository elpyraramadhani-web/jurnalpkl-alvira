import Link from "next/link";

export default function TidakDitemukan() {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-8 text-center">
      <div className="text-5xl font-bold text-blue-600">404</div>
      <h1 className="mb-2 mt-2 text-xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mb-5 text-sm text-slate-600">Alamat yang kamu buka tidak ada.</p>
      <Link href="/" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        Ke beranda
      </Link>
    </div>
  );
}