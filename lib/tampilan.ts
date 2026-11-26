import type { Status } from "@/data/tipe";

export const NAMA_STATUS: Record<Status, string> = {
    diajukan: "Diajukan",
    disetujui: "Disetujui",
    revisi: "Revisi"
};

export const BADGE: Record<Status, string> = {
    diajukan: "bg-amber-100 text-amber-800",
    disetujui: "bg-green-100 text-green-800",
    revisi: "bg-red-100 text-red-800",
}

export function tanggalIndo(t: string) {
    return new Date(`${t}T00:00:00Z`).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    })
}