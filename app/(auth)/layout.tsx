export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex justify-center bg-[#e1e1e1] dark:bg-neutral-950 overflow-y-auto">
      {children}
    </div>
  );
}
