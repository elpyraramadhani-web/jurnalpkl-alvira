import Link from "next/link";
import { cookies } from "next/headers";
import LinkNav from "@/components/LinkNav";
import { keluarMurid } from "@/app/masuk/actions";
import { keluarAdmin } from "@/app/login/actions";
import { ambilSiswa } from "@/data/ambil";
import { COOKIE_ADMIN, COOKIE_MURID, bacaToken } from "@/lib/token";

const wadah = "mx-auto flex min-h-14 max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2 text-sm";

export default async function Navbar() {
  const toples = await cookies();
  const admin = (await bacaToken(toples.get(COOKIE_ADMIN)?.value, "admin")) !== null;
  const siswaId = await bacaToken(toples.get(COOKIE_MURID)?.value, "murid");

  // admin: bilah gelap
  if (admin) {
    return (
      <header className="bg-slate-900">
        <nav aria-label="Navigasi admin" className={wadah}>
          <Link href="/admin" className="text-lg font-bold text-white">Panel Admin</Link>
          <LinkNav href="/admin" tepat gelap>Rekap</LinkNav>
          <LinkNav href="/admin/siswa" gelap>Siswa</LinkNav>
          <span className="flex-1" />
          <form action={keluarAdmin}>
            <button className="rounded border border-slate-500 px-3 py-1 text-white hover:bg-slate-700">Keluar</button>
          </form>
        </nav>
      </header>
    );
  }

  // murid yang sudah masuk
  if (siswaId !== null) {
    const siswa = await ambilSiswa(siswaId);
    return (
      <header className="border-b bg-white">
        <nav aria-label="Navigasi murid" className={wadah}>
          <Link href="/jurnal" className="text-lg font-bold text-blue-600">Jurnal PKL</Link>
          <LinkNav href="/jurnal" tepat>Jurnal saya</LinkNav>
          <LinkNav href="/jurnal/baru">Jurnal baru</LinkNav>
          <span className="flex-1" />
          <span className="text-slate-600">{siswa?.nama ?? "Murid"}</span>
          <form action={keluarMurid}>
            <button className="rounded border px-3 py-1 hover:bg-slate-100">Keluar</button>
          </form>
        </nav>
      </header>
    );
  }

  // pengunjung
  return (
    <header className="border-b bg-white">
      <nav aria-label="Navigasi utama" className={wadah}>
        <Link href="/" className="text-lg font-bold text-blue-600">Jurnal PKL</Link>
        <LinkNav href="/" tepat>Beranda</LinkNav>
        <span className="flex-1" />
        <LinkNav href="/masuk">Masuk murid</LinkNav>
        <LinkNav href="/login">Admin</LinkNav>
      </nav>
    </header>
  );
}