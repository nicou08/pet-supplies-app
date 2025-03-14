import { CartProvider } from "@/context/CartContext";

import Header from "@/components/header/Header";
import { AIAssistant } from "@/components/AIAssistant";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="w-full min-h-screen flex justify-center bg-[#e1e1e1] dark:bg-neutral-950 overflow-y-auto">
        <div className="w-full sm:w-11/12 max-w-screen-2xl bg-[#e1e1e1] dark:bg-neutral-950">
          <Header />
          {children}
          <AIAssistant />
        </div>
      </div>
    </CartProvider>
  );
}
