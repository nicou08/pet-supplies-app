"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  GraduationCap,
  Scissors,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function AppointmentRow() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/services");
  }, [router]);

  const services = [
    {
      title: "Veterinary Care",
      description:
        "Comprehensive health services from routine checkups to emergency care",
      features: [
        "24/7 Emergency Care",
        "Preventive Medicine",
        "Surgery & Diagnostics",
      ],
      icon: Stethoscope,
      color: "bg-green-100 text-green-800",
      stats: "500+ pets treated monthly",
    },
    {
      title: "Professional Training",
      description:
        "Expert behavioral training to build the perfect bond with your pet",
      features: [
        "Puppy Training",
        "Behavioral Correction",
        "Advanced Obedience",
      ],
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-800",
      stats: "95% success rate",
    },
    {
      title: "Premium Grooming",
      description:
        "Full-service grooming to keep your pet looking and feeling their best",
      features: [
        "Full Service Grooming",
        "Nail & Dental Care",
        "Spa Treatments",
      ],
      icon: Scissors,
      color: "bg-purple-100 text-purple-800",
      stats: "Award-winning groomers",
    },
  ];

  return (
    <div className="mx-auto px-4">
      <div className="bg-neutral-900 text-white rounded-2xl p-8 h-[500px] flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Pet Care Services
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Three specialized services, one commitment: exceptional care for
            your beloved pets
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${service.color} mr-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{service.title}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {service.stats}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 text-sm">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button
            asChild
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8"
          >
            <Link href="/services">
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
