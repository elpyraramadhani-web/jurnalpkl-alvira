import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, COOKIE_MURID, bacaToken } from "@/lib/token";

//panggil di awal halaman dan server action admin; proxy.ts saja tidak cukup
export async function pastikanAdmin() {
    const token = (await cookies()).get(COOKIE_ADMIN)?.value;
    if ((await bacaToken(token, "admin")) === null ) redirect("/login");
}

//mengembalikan id siswa dari cookie bertanda tangan, bukan dari formulir atau URL
export async function pastikanMurid(): Promise<number> {
    const token = (await cookies()).get(COOKIE_MURID)?.value;
    const id = await bacaToken(token, "murid");
    if (id === null ) redirect("/masuk");
    return id;
}