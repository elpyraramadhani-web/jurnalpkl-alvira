const HURUF = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buatKode() {
    const acak = new Uint8Array(4);
    crypto.getRandomValues(acak);
    return "PKL-" + Array.from(acak, (b) => HURUF [b % HURUF.length]).join("");
}