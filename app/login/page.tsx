import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, bacaToken } from "@/lib/token";
import FormMasuk from "@/components/FormMasuk";
import { masukAdmin } from "@/app/login/actions";

export const metadata: Metadata = { title: "Masuk Admin" };

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ [kunci: string]: string | string[] | undefined }>;
}) {
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