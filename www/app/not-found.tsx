import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-y-12 sm:space-y-16 leading-7">
      <header>
        <h1 className="text-lg font-medium">404 - Not Found</h1>
        <p className="text-[15px] text-muted-foreground font-mono">Page does not exist</p>
      </header>
      <section>
        <p className="text-muted-foreground">
          The page you are looking for does not exist. Please check the URL or navigate back to the
          homepage.
        </p>
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-2 mt-4 inline-block"
          aria-label="Go back home"
        >
          Go back home
        </Link>
      </section>
    </main>
  );
}
