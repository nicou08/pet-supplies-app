"use client";

import { useState, useMemo } from "react";

import { BookingStage1 } from "./BookingStage1";
import { BookingStage2 } from "./BookingStage2";
import { BookingStage3 } from "./BookingStage3";
import { BookingStage4 } from "./BookingStage4";
import { BookingStage5 } from "./BookingStage5";
import { BookingStage6 } from "./BookingStage6";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AppointmentInfo } from "@/types";
import { appointmentsTypeInfo, staffInfo } from "@/constants/data";

export function BookingForm() {
  const [currentStage, setCurrentStage] = useState(1);

  const progressPercentage = (currentStage - 1) * 20;

  const [bookingData, setBookingData] = useState<AppointmentInfo>({
    serviceType: "",
    pet: {
      name: "",
      type: "",
      age: 0,
    },
    provider: {
      id: "",
      name: "",
      specialty: [],
    },
    date: new Date(),
    time: "",
  });

  // Filter staff based on the selected service type
  const filteredStaff = useMemo(() => {
    if (bookingData.serviceType === "Veterinary") {
      return staffInfo.filter((staff) =>
        staff.speciality.includes("Veterinarian")
      );
    }
    if (bookingData.serviceType === "Grooming") {
      return staffInfo.filter((staff) => staff.speciality.includes("Groomer"));
    }
    if (bookingData.serviceType === "Training") {
      return staffInfo.filter((staff) => staff.speciality.includes("Trainer"));
    }
    return staffInfo.filter((staff) =>
      staff.speciality.includes(bookingData.serviceType)
    );
  }, [bookingData.serviceType]);

  const updateBookingData = (field: string, value: any) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Navigate to next stage
  const nextStage = () => {
    if (currentStage < 6) {
      setCurrentStage((prev) => prev + 1);
    }
  };

  // Navigate to previous stage
  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
    }
  };

  const validateStage = (): boolean => {
    switch (currentStage) {
      case 1:
        return bookingData.serviceType === "";
      case 2:
        return (
          !bookingData.pet.name || !bookingData.pet.type || !bookingData.pet.age
        );
      case 3:
        return !bookingData.provider.id;
      case 4:
        return !bookingData.date; // Disable if no date is selected
      case 5:
        return !bookingData.time; // Disable if no time is selected
      case 6:
        return true; // Always disable on the last stage
      default:
        return false; // Default to enabled
    }
  };

  const renderStep = () => {
    switch (currentStage) {
      case 1:
        return (
          <BookingStage1
            Services={appointmentsTypeInfo}
            onUpdateBookingData={updateBookingData}
            selectedService={bookingData.serviceType}
          />
        );
      case 2:
        return <BookingStage2 onUpdateBookingData={updateBookingData} />;
      case 3:
        return (
          <BookingStage3
            staff={filteredStaff}
            onUpdateBookingData={updateBookingData}
          />
        );
      case 4:
        return <BookingStage4 onUpdateBookingData={updateBookingData} />;
      case 5:
        return <BookingStage5 onUpdateBookingData={updateBookingData} />;
      case 6:
        return <BookingStage6 bookingData={bookingData} />;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Book a new appointment</CardTitle>
          <CardDescription className="text-lg">
            Follow the steps below to schedule an appointment for your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mt-4 h-2" />

          <div className="text-2xl font-bold">Step {currentStage}</div>
          <div className="mt-4">{renderStep()}</div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={prevStage}
            disabled={currentStage === 1}
          >
            Previous
          </Button>
          <Button onClick={nextStage} disabled={validateStage()}>
            {currentStage === 6 ? "Confirm" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
