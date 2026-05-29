import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import SettingsSidebar from "./components/SettingsSidebar";
import AccountTab from "./components/tabs/AccountTab";
import AppointmentsTab from "./components/tabs/AppointmentsTab";
import PetsTab from "./components/tabs/PetsTab";
import BillingTab from "./components/tabs/BillingTab";

const VALID_TABS = ["account", "appointments", "pets", "billing"] as const;
type Tab = (typeof VALID_TABS)[number];

function resolveTab(raw: string | undefined): Tab {
  if (raw && (VALID_TABS as readonly string[]).includes(raw)) return raw as Tab;
  return "account";
}

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { tab: rawTab } = await searchParams;
  const activeTab = resolveTab(rawTab);
  const user = session.user;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8">
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>
      <div className="flex gap-8">
        <SettingsSidebar activeTab={activeTab} />
        <main className="flex-1 min-w-0">
          {activeTab === "account" && <AccountTab user={user} />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "pets" && <PetsTab />}
          {activeTab === "billing" && <BillingTab />}
        </main>
      </div>
    </div>
  );
}
