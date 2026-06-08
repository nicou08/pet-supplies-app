"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDE_FOOTER_ON = ["/checkout", "/return"];

export default function Footer() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ON.some((path) => pathname.startsWith(path))) return null;

  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-semibold text-foreground text-lg">Pet Supplies</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything your pet needs, all in one place.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="font-semibold text-foreground text-sm mb-3">Shop</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/pets" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-semibold text-foreground text-sm mb-3">Services</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services?serviceType=grooming" className="text-muted-foreground hover:text-foreground transition-colors">
                  Grooming
                </Link>
              </li>
              <li>
                <Link href="/services?serviceType=training" className="text-muted-foreground hover:text-foreground transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/services?serviceType=veterinary" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vet Consultations
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pet+
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-foreground text-sm mb-3">Info</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>&copy; 2026 Pet Supplies. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
