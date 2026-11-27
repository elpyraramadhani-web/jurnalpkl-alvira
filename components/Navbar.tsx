"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { keluarMurid } from "@/app/masuk/actions";
import { keluarAdmin } from "@/app/login/actions";

export type PeranNav = "pengunjung" | "murid" | "admin";

// navbar navigasi: menu mengikuti siapa yang sedang masuk
const menuPeran: Record<PeranNav, { href: string; teks: string }[]> = {
    pengunjung: [
        { href: "/", teks: "Beranda" },
        { href: "/masuk", teks: "Masuk murid" },
        { href: "/login", teks: "Admin" },
    ],
    murid: [
        { href: "/jurnal", teks: "Jurnal saya" },
        { href: "/jurnal/baru", teks: "Jurnal baru" },
    ],
    admin: [
        { href: "/admin", teks: "Rekap" },
        { href: "/admin/siswa", teks: "Siswa" },
    ],
};

export default function Navbar({ peran, nama }: { peran: PeranNav; nama?: string }) {
    const pathname = usePathname();
    const menu = menuPeran[peran];

    // menu yang menyala: alamat yang paling cocok (paling panjang),
    // jadi /jurnal tidak ikut menyala saat membuka /jurnal/baru
    const aktif = menu
        .filter((m) => pathname === m.href || (m.href !== "/" && pathname.startsWith(m.href + "/")))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    return (
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b bg-white px-6 py-3">
            <span className="text-lg font-bold text-blue-600">
                {peran === "admin" ? "Panel Admin" : "Jurnal PKL"}
            </span>
            {menu.map((m) => (
                <Link
                    key={m.href}
                    href={m.href}
                    className={m.href === aktif
                        ? "font-semibold text-blue-600"
                        : "text-slate-600 hover:text-blue-600"}
                >
                    {m.teks}
                </Link>
            ))}
            <span className="flex-1" />
            {peran === "murid" && (
                <>
                    <span className="text-slate-600">{nama ?? "Murid"}</span>
                    <form action={keluarMurid}>
                        <button className="rounded border px-3 py-1 hover:bg-slate-100">Keluar</button>
                    </form>
                </>
            )}
            {peran === "admin" && (
                <form action={keluarAdmin}>
                    <button className="rounded border px-3 py-1 hover:bg-slate-100">Keluar</button>
                </form>
            )}
        </nav>
    );
}