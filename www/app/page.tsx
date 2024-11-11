import { getMDXPage } from "@/lib/mdx";

export default async function Page() {
  const page = await getMDXPage("index");
  return <main className="leading-7 space-y-6 sm:space-y-8">{page}</main>;
}
