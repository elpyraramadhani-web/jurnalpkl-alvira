export type Status = "diajukan" | "disetujui" | "revisi";

export type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
};

export type Jurnal = {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
  status: Status;
  catatan: string | null;
  dibuat: string;
};

export type SiswaAdmin = Siswa & { kode: string};

export type BarisRekap = {
  id: number;
  nama: string;
  kelas: string;
  jurnal: number;
  jam: number;
  menunggu: number
};

export type BarisJurnal = Jurnal & {
  siswa: { nama: string; kelas: string } | null;
}

