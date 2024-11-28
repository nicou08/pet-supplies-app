import Link from "next/link";
import {
  PawPrint,
  Bone,
  Scissors,
  CircleDollarSign,
  ShoppingBasket,
} from "lucide-react";

interface InteractiveItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function InteractiveItem({ title, description, icon }: InteractiveItemProps) {
  return (
    <div className="h-32 w-[370px] bg-stone-300 px-6 cursor-pointer rounded-sm hover:border-2 hover:border-black border-2 border-transparent flex text-lg text-stone-800">
      <div className="basis-2/3 h-full pt-6">
        <div className="font-bold text-2xl">{title}</div>
        <div className="font-normal pt-1 pb-8 text-md">{description}</div>
      </div>
      <div className="h-full flex items-center justify-center pb-1 pl-4 basis-1/3">
        {icon}
      </div>
    </div>
  );
}

function InteractiveItemSignIn() {
  return (
    <div className="h-32 w-[370px] bg-neutral-700 cursor-pointer rounded-sm flex text-lg py-4 px-6 text-white">
      <div className="basis-2/3">
        <div className="font-bold text-2xl">Sign In</div>
        <div className="font-normal pt-1 pb-8 text-md">
          To earn savings, rewards, and more!
        </div>
      </div>
      <div className="h-full flex items-center justify-center pb-2 pl-4 basis-1/3">
        <Bone size={50} />
      </div>
    </div>
  );
}

export function InteractiveRow() {
  return (
    <div className="flex flex-row justify-between">
      <InteractiveItemSignIn />
      <InteractiveItem
        title="Book Grooming"
        description="Trim ya dawg"
        icon={<Scissors size={50} />}
      />
      <InteractiveItem
        title="New Arrivals"
        description="View our latest products"
        icon={<ShoppingBasket size={50} />}
      />
      <InteractiveItem
        title="Sales"
        description="Get the best deals"
        icon={<CircleDollarSign size={50} />}
      />
    </div>
  );
}
