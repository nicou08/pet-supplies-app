import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const user = session.user;

  // Sidebar sections
  const sections = [
    { key: "account", label: "Your account" },
    { key: "billing", label: "Billing" },
    { key: "signout", label: "Sign Out" },
  ];

  // For demo, default to account section
  // In a real app, use useState or URL param for section switching
  let activeSection = "account";

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full min-h-[60vh] py-8 px-2 sm:px-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-neutral-300 dark:border-neutral-800 pb-4 md:pb-0">
        <nav className="flex md:flex-col gap-2">
          {sections.map((section) => (
            <a
              key={section.key}
              href={`#${section.key}`}
              className={`px-4 py-2 rounded-md text-left text-base font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                activeSection === section.key
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 w-full max-w-2xl">
        {/* Your Account Section */}
        <div id="account" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your account</h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-lg">{user?.name}</div>
              <div className="text-neutral-500 text-sm">{user?.email}</div>
            </div>
          </div>
          {/* Update name/email form (demo only, not functional) */}
          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full px-3 py-2 border rounded-md bg-background border-neutral-300 dark:border-neutral-700"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-3 py-2 border rounded-md bg-background border-neutral-300 dark:border-neutral-700"
                disabled
              />
            </div>
            <Button type="button" variant="secondary" disabled>
              Update (demo only)
            </Button>
          </form>
        </div>

        {/* Billing Section */}
        <div id="billing" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Billing</h2>
          <div className="text-neutral-500">
            No billing information available.
          </div>
        </div>

        {/* Sign Out Section */}
        <div id="signout">
          <h2 className="text-xl font-semibold mb-4">Sign Out</h2>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="destructive">
              Sign Out
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
