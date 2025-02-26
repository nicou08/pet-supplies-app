"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
    toggleCart,
    closeCart,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetTrigger
          onClick={openCart}
          className="focus:outline-none  w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black hover:bg-neutral-300 data-[state=open]:bg-neutral-300 dark:text-white cursor-pointer  dark:hover:bg-neutral-900 transition-shadow duration-200"
        >
          <ShoppingCart />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>You Cart</SheetTitle>
          </SheetHeader>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center mb-2"
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
          <div className="mt-4">
            <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <Button className="w-full bg-blue-500 text-white py-2 rounded">
              Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
