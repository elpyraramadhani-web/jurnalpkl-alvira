import { pastikanAdmin } from "@/lib/sesi";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await pastikanAdmin();
  return <>{children}</>;
}