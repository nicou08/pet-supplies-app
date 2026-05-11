import { CartProvider } from "@/context/CartContext";

import Header from "@/components/header/header";
import { AIAssistant } from "@/components/AIAssistant";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="w-full min-h-screen flex justify-center bg-background overflow-y-auto">
        <div className="w-full sm:w-11/12 max-w-screen-2xl bg-background">
          <Header />
          {children}
          <AIAssistant />
        </div>
      </div>
    </CartProvider>
  );
}
