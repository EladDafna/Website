/**
 * Shown only while NEXT_PUBLIC_GITHUB_USERNAME is unset, so a fresh clone
 * explains itself instead of rendering an empty projects page.
 */
export default function SetupNotice() {
  return (
    <div className="glass rounded-2xl p-7">
      <h2 className="text-lg font-semibold tracking-tight">
        One step left: connect the GitHub account
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Projects are pulled live from the GitHub REST API, but no account is
        configured yet. Set the username and the grid fills itself in, both
        locally and on every deploy.
      </p>
      <ol className="mt-5 space-y-3 text-sm text-muted">
        <li>
          <span className="text-foreground">1.</span> Create{" "}
          <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-neon-cyan">
            .env.local
          </code>{" "}
          in the project root with:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-raised p-3 font-mono text-xs text-foreground">
            NEXT_PUBLIC_GITHUB_USERNAME=your-username
          </pre>
        </li>
        <li>
          <span className="text-foreground">2.</span> Add the same variable in
          the Vercel project under Settings &rarr; Environment Variables.
        </li>
        <li>
          <span className="text-foreground">3.</span> Restart the dev server, or
          redeploy.
        </li>
      </ol>
    </div>
  );
}
