"use client";

import { Button } from "@/components/ui/button";
import { BookingDataUpdater } from "@/types";

type Service = {
  name: string;
  description: string;
  icon: string;
  bgColor: string;
};

type BookingStage1Props = {
  Services: Service[];
  onUpdateBookingData: BookingDataUpdater;
  selectedService: string;
};

export function BookingStage1({
  Services,
  onUpdateBookingData,
  selectedService,
}: BookingStage1Props) {
  const bgColorMap: { [key: string]: string } = {
    blue: "bg-blue-200",
    green: "bg-green-200",
    purple: "bg-purple-200",
  };

  return (
    <div>
      <div className="font-bold text-lg pb-7">Select Appointment Type</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Services.map((service, index) => (
          <Button
            key={index}
            className={`flex flex-col justify-start items-start h-48 py-5 px-8 gap-0 ${
              selectedService === service.name
                ? "bg-neutral-400 hover:bg-neutral-400"
                : `${bgColorMap[service.bgColor]} hover:${
                    bgColorMap[service.bgColor]
                  } hover:shadow-lg dark:hover:shadow-white/25`
            } active:scale-95 transition-transform duration-100 `}
            onClick={() => {
              onUpdateBookingData("serviceType", service.name);
              onUpdateBookingData("provider", {
                id: "",
                name: "",
                specialty: [],
              });
            }}
          >
            <div className="text-4xl pb-5">{service.icon}</div>
            <div className="text-xl font-semibold pb-2 text-black">
              {service.name}
            </div>
            <div className="text-md font-normal text-gray-600 text-left text-wrap">
              {service.description}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
