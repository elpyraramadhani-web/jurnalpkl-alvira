export type IsianJurnal = {
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi: string;
};
export type GalatJurnal = Partial<Record<keyof IsianJurnal, string>>;

//tanggal hari wib
export function hariIni() {
    return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta"});
};

function geser(tanggal: string, hari: number){
    const d = new Date(`${tanggal}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + hari);
    return d.toISOString().slice(0, 10);
}

export function batasTanggal() {
    const max = hariIni();
    return { min: geser(max, -7), max};
}

// "2026-02-31" bentuknya benar tetapi tanggalnya tidak ada
function tanggalSah(t: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return false;
  const d = new Date(`${t}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === t;
}

//saat mengubah jurnal tanggalnya tidak berubah
export function periksaJurnal(i: IsianJurnal, tanggalLama?: string): GalatJurnal {
    const g: GalatJurnal ={};
    const {min, max} = batasTanggal();
    const durasi = Number(i.durasi);

    if (!tanggalSah(i.tanggal)) {
        g.tanggal = "Tanggal tidak valid";
    } else if (i.tanggal !== tanggalLama){
        if (i.tanggal > max) g.tanggal = "Tanggal tidak boleh di masa depan";
        else if (i.tanggal < min) g.tanggal = "Tanggal paling jauh 7 hari ke belakang";
    }
    if (i.kegiatan.length < 30 || i.kegiatan.length > 500){
        g.kegiatan = "Kegiatan 30 sampai 500 huruf";
    }
    if (i.kegiatan.length < 3 || i.kompetensi.length > 60){
        g.kompetensi = "Kompetensi 3 sampai 60 huruf";
    }
    if (i.durasi === "" || !Number.isInteger(durasi) || durasi < 1 || durasi >10) {
        g.durasi = "Durasi 1 sampai 10 jam (bilangan bulat)";
    }
    return g;
}   
