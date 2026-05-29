import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

async function signOutAction() {
  "use server";
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}

interface AccountTabProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AccountTab({ user }: AccountTabProps) {
  const initials = user.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="space-y-10">
      {/* Profile */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 text-xl">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-base">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
        </div>
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              defaultValue={user.name ?? ""}
              className="w-full px-3 py-2 border rounded-md bg-background border-border text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue={user.email ?? ""}
              className="w-full px-3 py-2 border rounded-md bg-background border-border text-sm"
              disabled
            />
          </div>
          <Button type="button" variant="secondary" size="sm" disabled>
            Update (read-only)
          </Button>
        </form>
      </section>

      {/* Appearance */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Theme is controlled globally via the header. Per-account appearance settings coming soon.
        </p>
      </section>

      {/* Danger Zone */}
      <section className="border border-destructive/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you sign out, you will need to authenticate again to access your account.
        </p>
        <form action={signOutAction}>
          <Button type="submit" variant="destructive" size="sm">
            Sign out
          </Button>
        </form>
      </section>
    </div>
  );
}
