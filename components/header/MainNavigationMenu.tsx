"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNavigationMenu() {
  return (
    <NavigationMenu className="">
      <NavigationMenuList className="text-black dark:text-white space-x-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Pets
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2">
              <ListItem href="/pets/dog" title="Dog" />
              <ListItem href="/shop" title="Cat" />
              <ListItem href="/shop" title="Guinea Pig" />
              <ListItem href="/shop" title="Hamster" />
              <ListItem href="/shop" title="Rabbit" />
              <ListItem href="/shop" title="Fish" />
              <ListItem href="/shop" title="Bird" />
              <ListItem href="/shop" title="Food" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2">
              <ListItem href="/shop?productType=food" title="Food"></ListItem>
              <ListItem href="/shop?productType=toys" title="Toys"></ListItem>
              <ListItem href="/shop?productType=cages" title="Cages"></ListItem>
              <ListItem
                href="/shop?productType=fish-tanks"
                title="Fish Tanks"
              ></ListItem>
              <ListItem
                href="/shop?productType=beddings"
                title="Beddings"
              ></ListItem>
              <ListItem
                href="/shop?productType=leashes"
                title="Leashes"
              ></ListItem>
              <ListItem
                href="/shop?productType=hideouts"
                title="Hideouts"
              ></ListItem>
              <ListItem
                href="/shop?productType=shit-trays"
                title="Shit Trays"
              ></ListItem>
              <ListItem
                href="/shop?productType=pharmaceuticals"
                title="Pharmaceuticals"
              ></ListItem>
              <ListItem
                href="/shop?productType=utilities"
                title="Utilities"
              ></ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2">
              <ListItem href="/docs" title="Grooming"></ListItem>
              <ListItem href="/docs" title="Training"></ListItem>
              <ListItem href="/docs" title="Vet Consultaions"></ListItem>
              <ListItem href="/docs" title="Pet+"></ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/deals" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Deals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-5 leading-none no-underline outline-none transition-colors hover:bg-accent dark:hover:bg-neutral-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
