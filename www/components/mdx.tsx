import Link, { LinkProps } from "next/link";

import { cn } from "@/lib/utils";
import { HeadingProps } from "@/types/mdx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const components = {
  h1: (props: HeadingProps) => <h1 {...props} className="text-lg font-medium" />,
  h2: (props: HeadingProps) => <h2 {...props} className="text-[17px] font-medium" />,
  h3: (props: HeadingProps) => <h3 {...props} className="font-[450]" />,
  h4: (props: HeadingProps) => <h4 {...props} className="leading-7" />,
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-muted-foreground" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a
      className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors ease duration-200"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLProps<HTMLElement>) => (
    <blockquote className="border-l-2 pl-3 pr-2 sm:pl-4 md:pr-3 italic font-serif bg-muted/20 py-2">
      {props.children}
    </blockquote>
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => <strong className="font-medium" {...props} />,
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside" {...props} />
  ),
  ol: ({ children }: React.HTMLProps<HTMLOListElement>) => (
    <ol className="list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }: React.HTMLProps<HTMLLIElement>) => (
    <li className="ml-2 text-muted-foreground">{children}</li>
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => (
    <tr className="m-0 border-t p-0" {...props} />
  ),
  th: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <th
      className="border px-4 py-2 text-left font-medium [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <td
      className="border text-muted-foreground px-4 py-1.5 text-[15px] text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <table className="w-full table-auto border rounded-lg" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => {
    const isInline = typeof props.children === "string" && !props.children.includes("\n");
    return (
      <code
        className={cn(
          "rounded-lg px-1 py-0.5 font-mono text-sm",
          isInline && "border bg-background"
        )}
        {...props}
      />
    );
  },
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre {...props} className="border overflow-hidden w-full">
      <ScrollArea className="p-2 md:p-3.5 code-wrapper">
        {props.children}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </pre>
  ),
  Link: (props: LinkProps) => (
    <Link {...props} className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors ease duration-200" />
  ),
};

export default components;
