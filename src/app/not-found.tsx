import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="font-mono text-sm text-neon-cyan">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="neon-text">Lost in space</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        That page does not exist. It may have been renamed, or it never made it
        off the launch pad.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-200 hover:scale-[1.03]"
      >
        Back home
      </Link>
    </div>
  );
}
