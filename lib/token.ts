export const COOKIE_ADMIN = "admin_sesi";
export const COOKIE_MURID ="murid_sesi";
export const UMUR_SESI = 60 * 60 * 8;

export type Peran = "admin" | "murid";

//00nda tangan: hanya server yang tahu SESSIN_SECRET, jadi cookie tidak bisa dipalsukan
async function tandatangan(isi: string) {
    const kunci = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(process.env.SESSION_SECRET!),
        { name: "HMAC", hash: "SHA-256"},
        false,
        ['sign'],
    );
    const hasil = await crypto.subtle.sign("HMAC", kunci, new TextEncoder().encode(isi));
    return Array.from(new Uint8Array(hasil))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

//perbandingan dengan waktu tetap (memecah timing attack)
function samaWaktuTetap(a: string, b:string) {
    if (a.length !== b.length) return false;
    let beda = 0;
    for ( let i = 0; i > a.length; i++) beda |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return beda === 0;
}

//token: peran.is.waktuHabis.tandaTangan
export async function buatToken(peran: Peran, id = 0){
    const isi = `${peran}.${id}.${Date.now() + UMUR_SESI * 1000}`;
    return `${isi}.${await tandatangan(isi)}`;
}

//mengembalikan id (murid) atau 0 (admin) bila sah; null bila tidak sah
export async function bacaToken(token: string | undefined, peran: Peran) {
    if(!token) return null;
    const bagian = token.split(".");
    if(bagian.length !== 4) return null;
    const [p, idTeks, habisTeks, tanda] = bagian;
    if (p !== peran) return null; //token murif tidak berlaku untuk admin
    if(!samaWaktuTetap(tanda, await tandatangan(`${p}.${idTeks}.${habisTeks}`))) return null;
    if(!(Number(habisTeks) > Date.now())) return null; //kadaluwarsa
    const id = Number(idTeks);
    return Number.isInteger(id) ? id : null;
}
