import { Metadata, Viewport } from "next";

const siteConfig = {
  title: "ChkEnv",
  description: "ChkEnv is a tool to check the environment variables of your project.",
  ogImage: "https://chkenv.sudipbiswas.dev/og.jpg",
  url: "https://chkenv.sudipbiswas.dev",
  links: {
    twitter: `https://x.com/sudipbiswas_dev`,
    github: `https://github.com/sudipb7`,
  },
};

type SiteConfig = typeof siteConfig;

const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  creator: siteConfig.title,
  authors: [
    {
      name: siteConfig.title,
      url: siteConfig.url,
    },
  ],
  keywords: [
    "ChkEnv",
    "Environment Variables",
    "Environment",
    "Variables",
    "Project",
    "Tool",
    "CLI",
    "Node.js",
    "JavaScript",
    "npm",
    "yarn",
    "pnpm",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  icons: "/logo.svg",
};

const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  userScalable: false,
  colorScheme: "light dark",
};

export { metadata, siteConfig, viewport };
export type { SiteConfig };
