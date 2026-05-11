"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { CartItem } from "./CartItem-2";
import { Button } from "@/components/ui/button";

export function HeaderUtilCartBtn() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    openCart,
    closeCart,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openCart();
    } else {
      closeCart();
    }
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger className="focus:outline-none  w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-foreground hover:bg-accent data-[state=open]:bg-accent cursor-pointer transition-shadow duration-200">
          <ShoppingCart />
        </SheetTrigger>
        <SheetContent className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>You Cart</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center mb-2 gap-3"
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <SheetFooter>
            <div className="w-full mt-4 flex flex-col space-y-6">
              <p className="text-lg font-bold">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <SheetClose asChild>
                <Link href="/checkout">
                  <Button className="w-full bg-blue-500 text-white py-2 rounded">
                    Checkout
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
