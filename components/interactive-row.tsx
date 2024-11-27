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
    <div className="h-36 w-[350px] bg-stone-300 cursor-pointer rounded-sm hover:border-2 hover:border-black border-2 border-transparent flex text-lg p-6 text-stone-800">
      <div className="basis-2/3 pt-2">
        <div className="font-bold text-2xl">{title}</div>
        <div className="font-normal pt-1 pb-8 text-md">{description}</div>
      </div>
      <div className="h-full flex items-center justify-center pb-4 pl-4 basis-1/3">
        {/* <Scissors size={50} /> */}
        {icon}
      </div>
    </div>
  );
}

function InteractiveItemSignIn() {
  return (
    <div className="h-36 w-[350px] bg-neutral-700 cursor-pointer rounded-sm flex text-lg p-6 text-white">
      <div className="basis-2/3">
        <div className="font-bold text-2xl">Sign In</div>
        <div className="font-normal pt-1 pb-8 text-md">
          To earn savings, rewards, and more!
        </div>
      </div>
      <div className="h-full flex items-center justify-center pb-4 pl-4 basis-1/3">
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
