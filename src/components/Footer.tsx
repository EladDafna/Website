import EmailButton from "@/components/EmailButton";
import { siteConfig, socialLinks } from "@/lib/config";

const LINK_CLASS = "border-0 bg-transparent p-0 text-inherit transition-colors hover:text-neon-cyan";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
        <ul className="flex flex-wrap items-center gap-5">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={LINK_CLASS}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <EmailButton email={siteConfig.email} className={`cursor-pointer ${LINK_CLASS}`} />
          </li>
        </ul>
      </div>
    </footer>
  );
}
