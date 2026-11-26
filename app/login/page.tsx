import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, bacaToken } from "@/lib/token";
import FormMasuk from "@/components/FormMasuk";
import { masukAdmin } from "@/app/login/actions";

export const metadata: Metadata = { title: "Masuk Admin" };

type Params = Promise<{ [kunci: string]: string | string[] | undefined }>;

async function FormLogin({ searchParams }: { searchParams: Params }) {
  const { dari } = await searchParams;
  if ((await bacaToken((await cookies()).get(COOKIE_ADMIN)?.value, "admin")) !== null) {
    redirect("/admin");
  }
  return (
    <FormMasuk
      judul="Masuk Admin"
      petunjuk="Khusus guru pembimbing."
      label="Kata sandi"
      nama="sandi"
      placeholder="Kata sandi"
      tipe="password"
      aksi={masukAdmin}
      dari={typeof dari === "string" ? dari : "/admin"}
    />
  );
}

export default function Login({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<p className="p-6 text-slate-500">Memuat...</p>}>
      <FormLogin searchParams={searchParams} />
    </Suspense>
  );
}