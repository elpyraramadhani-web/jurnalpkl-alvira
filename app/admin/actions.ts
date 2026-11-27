// "use server";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { supabaseAdmin } from "@/lib/supabase-admin";
// import { pastikanAdmin } from "@/lib/sesi";
// import { buatKode } from "@/lib/kode";

// function kembaliDengan(kembali: string, kunci: "info" | "galat", pesan: string): never {
//     const u = new URL(kembali.startsWith("/admin") ? kembali: "/admin", "http://lokal");
//     u.searchParams.delete("info");
//     u.searchParams.delete("galat");
//     u.searchParams.set(kunci, pesan);
//     redirect(u.pathname + u.search)
// }

// function segarkan()