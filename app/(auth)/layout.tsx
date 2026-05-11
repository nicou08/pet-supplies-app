export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex justify-center bg-background overflow-y-auto">
      {children}
    </div>
  );
}
