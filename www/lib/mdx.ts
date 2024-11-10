import fs from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { compileMDX } from "next-mdx-remote/rsc";

import components from "@/components/mdx";
import { FrontMatter } from "@/types/mdx";

const ROOT = path.join(process.cwd(), "docs");

export async function getMDXPage(slug: string) {
  const fullPath = path.join(ROOT, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  const { content, frontmatter } = await compileMDX({
    source: fileContent,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            { keepBackground: false, theme: { light: "github-light", dark: "github-dark" } },
          ],
        ],
      },
    },
  });

  return {
    mdxContent: content,
    meta: {
      ...frontmatter,
      slug,
    } as FrontMatter,
  };
}
