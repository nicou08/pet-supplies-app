"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  computeLinePrice,
  saleBadgeLabel,
  type SaleInfo,
} from "@/lib/pricing";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sale?: SaleInfo | null;
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const line = computeLinePrice(item.price, item.quantity, item.sale);
  const saleLabel = saleBadgeLabel(item.sale);
  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="relative w-16 h-16 rounded-md overflow-hidden">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        {line.discountedUnitPrice !== null ? (
          <p className="text-sm">
            <span className="text-gray-400 line-through mr-1">
              ${item.price.toFixed(2)}
            </span>
            <span className="text-green-600 dark:text-green-500 font-medium">
              ${line.discountedUnitPrice.toFixed(2)}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
        )}
        {saleLabel && (
          <p className="text-xs text-green-600 dark:text-green-500">
            {saleLabel}
            {line.freeUnits > 0 ? ` · ${line.freeUnits} free` : ""}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (item.quantity === 1) {
              onRemove(item.id);
            } else {
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1));
            }
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
