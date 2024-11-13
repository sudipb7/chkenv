import { getMDXPage } from "@/lib/mdx";

export default async function Page() {
  const page = await getMDXPage("index");
  return <main className="leading-7 space-y-5 sm:space-y-7">{page}</main>;
}
