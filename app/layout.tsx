import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { ambilSiswa } from "@/data/ambil";
import { COOKIE_ADMIN, COOKIE_MURID, bacaToken } from "@/lib/token";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: { default: "Jurnal PKL", template: "%s · Jurnal PKL" },
  description: "Jurnal harian praktik kerja lapangan.",
};

// membaca cookie di server, lalu menyerahkan peran ke Navbar
async function NavbarSesi() {
  const toples = await cookies();
  if ((await bacaToken(toples.get(COOKIE_ADMIN)?.value, "admin")) !== null) {
    return <Navbar peran="admin" />;
  }
  const siswaId = await bacaToken(toples.get(COOKIE_MURID)?.value, "murid");
  if (siswaId !== null) {
    const siswa = await ambilSiswa(siswaId);
    return <Navbar peran="murid" nama={siswa?.nama} />;
  }
  return <Navbar peran="pengunjung" />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} flex min-h-screen flex-col bg-slate-50 text-slate-800`}>
        <Suspense fallback={<div className="h-14 border-b bg-white" />}>
          <NavbarSesi />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
        <footer className="border-t bg-white py-4 text-center text-xs text-slate-600">
          Jurnal PKL · Aplikasi jurnal harian praktik kerja lapangan
        </footer>
      </body>
    </html>
  );
}