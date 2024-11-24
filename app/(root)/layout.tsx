import Header from "@/components/header";

export default function RootLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex justify-center bg-[#e1e1e1] dark:bg-neutral-950">
      <div className="w-full sm:w-11/12 max-w-screen-2xl bg-[#e1e1e1] dark:bg-neutral-950">
        <Header />
        {children}
      </div>
    </div>
  );
}
