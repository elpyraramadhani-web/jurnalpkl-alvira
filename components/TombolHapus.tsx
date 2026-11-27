"use client";

export default function TombolHapus() {
  return (
    <button
      className="text-red-700 underline"
      onClick={(e) => {
        if (!window.confirm("Yakin hapus siswa ini?")) e.preventDefault();
      }}
    >
      Hapus
    </button>
  );
}