"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { petTypes, isLoading: petTypesLoading } = usePetTypes();
  const { productTypes, isLoading: productTypesLoading } = useProductTypes();

  React.useEffect(() => {
    petTypes?.forEach((pet) => {
      router.prefetch(`/pets/${encodeURIComponent(pet.name)}`);
    });
  }, [petTypes, router]);

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-foreground space-x-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-none">
            Pets
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-background/50">
              {petTypesLoading && <li>Loading...</li>}
              {petTypes?.map((pet) => (
                <ListItem
                  key={pet.id}
                  href={`/pets/${encodeURIComponent(pet.name)}`}
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
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-background/50">
              {productTypesLoading && <li>Loading...</li>}
              {productTypes?.map((type) => (
                <ListItem
                  key={type.id}
                  href={`/shop?productType=${encodeURIComponent(type.name)}`}
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
            <ul className="grid w-[250px] gap-3 p-4 md:w-[350px] md:grid-cols-2 bg-background/50">
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

type ListItemProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-5 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
