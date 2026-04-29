"use client";

import * as React from "react";

import { usePetTypes } from "@/hooks/usePetTypes";
import { useProductTypes } from "@/hooks/useProductTypes";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function MainNavigationMenu() {
  const { petTypes, isLoading: petTypesLoading } = usePetTypes();
  const { productTypes, isLoading: productTypesLoading } = useProductTypes();

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-black dark:text-white space-x-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Pets
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-[#e1e1e1]/50 dark:bg-neutral-950">
              {petTypesLoading && <li>Loading...</li>}
              {petTypes?.map((pet) => (
                <ListItem
                  key={pet.id}
                  href={`/pets/${pet.name}`}
                  title={pet.displayName}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-[#e1e1e1]/50 dark:bg-neutral-950">
              {productTypesLoading && <li>Loading...</li>}
              {productTypes?.map((type) => (
                <ListItem
                  key={type.id}
                  href={`/shop?productType=${type.name}`}
                  title={type.displayName}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-[#e1e1e1]/50 dark:bg-neutral-950">
              <ListItem href="/services?serviceType=grooming" title="Grooming" />
              <ListItem href="/services?serviceType=training" title="Training" />
              <ListItem
                href="/services?serviceType=veterinary"
                title="Vet Consultaions"
              />
              <ListItem href="/services" title="Pet+" />
            </ul>
          </NavigationMenuContent>
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
