// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDX = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export type ContentType = "blog" | "interaction";

type FrontMatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  keywords: string[];
  type: ContentType;
};

type Content = {
  mdxContent: MDX;
  meta: FrontMatter;
};

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

type PageContent = {
  current: Content;
  previous: Content | null;
  next: Content | null;
};

export type { FrontMatter, Content, MDX, PageContent, HeadingProps };
