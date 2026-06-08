import { CartProvider } from "@/context/CartContext";

import Header from "@/components/header/header";
import { AIAssistant } from "@/components/AIAssistant";
import Footer from "@/components/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="w-full min-h-screen flex flex-col bg-background overflow-y-auto">
        <div className="flex-1 flex justify-center">
          <div className="w-full sm:w-11/12 max-w-screen-2xl bg-background flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}
