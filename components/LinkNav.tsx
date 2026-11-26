"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkNav({
  href, children, tepat = false, gelap = false,
}: {
  href: string;
  children: React.ReactNode;
  tepat?: boolean; // true: aktif hanya bila alamatnya persis sama
  gelap?: boolean; // true: untuk bilah admin yang gelap
}) {
  const path = usePathname();
  const aktif = tepat ? path === href : path === href || path.startsWith(href + "/");
  const warna = gelap
    ? aktif ? "font-bold text-white" : "text-slate-300 hover:text-white"
    : aktif ? "font-bold text-blue-600" : "text-slate-800 hover:text-blue-600";
  return (
    <Link href={href} aria-current={aktif ? "page" : undefined} className={warna}>
      {children}
    </Link>
  );
}