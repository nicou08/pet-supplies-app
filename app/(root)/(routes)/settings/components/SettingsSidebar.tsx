import Link from "next/link";

const NAV_ITEMS = [
  { key: "account", label: "Account" },
  { key: "appointments", label: "Appointments" },
  { key: "pets", label: "Pets" },
  { key: "billing", label: "Billing" },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

interface SettingsSidebarProps {
  activeTab: NavKey | string;
}

export default function SettingsSidebar({ activeTab }: SettingsSidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-border pr-4">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <Link
              key={key}
              href={`/settings?tab=${key}`}
              className={`relative px-4 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                isActive ? "font-semibold bg-accent" : "font-normal text-muted-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-foreground" />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
