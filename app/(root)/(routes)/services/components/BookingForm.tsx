"use client";

import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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

import { useStaff } from "@/hooks/useStaff";
import { usePetTypes } from "@/hooks/usePetTypes";

import { formatSlotLabel } from "@/lib/slots";
import {
  AppointmentInfo,
  BookingDataUpdater,
  CreateAppointmentInfo,
} from "@/types";
import { appointmentsTypeInfo } from "@/constants/data";

export function BookingForm() {
  const [bookingStatus, setBookingStatus] = useState<
    "form" | "loading" | "success"
  >("form");
  const searchParams = useSearchParams();
  const queryServiceType = searchParams.get("serviceType");

  const [currentStage, setCurrentStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    staff: staffInfo = [],
    isLoading: staffLoading,
    isError: staffError,
  } = useStaff();

  const { petTypes: petTypesInfo = [] } = usePetTypes();

  const progressPercentage = (currentStage - 1) * 20;

  const [bookingData, setBookingData] = useState<AppointmentInfo>({
    serviceType: queryServiceType
      ? queryServiceType.charAt(0).toUpperCase() + queryServiceType.slice(1)
      : "",
    pet: {
      name: "",
      type: "",
      typeId: "",
      age: 0,
    },
    provider: {
      id: "",
      name: "",
      specialty: [],
    },
    date: new Date(),
    time: "",
    notes: "",
  });

  const updateBookingData: BookingDataUpdater = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedStaff = staffInfo.find(
    (s) => s.id === bookingData.provider.id
  );
  const providerSchedules = selectedStaff?.schedules ?? [];

  const nextStage = () => {
    if (currentStage < 6) {
      setCurrentStage((prev) => prev + 1);
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
    }
  };

  const onConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setBookingStatus("loading");

    const bookingDataToSubmit: CreateAppointmentInfo = {
      petTypeId: bookingData.pet.typeId,
      petName: bookingData.pet.name,
      petAge: bookingData.pet.age,
      appointmentDate: bookingData.date,
      appointmentTime: bookingData.time,
      appointmentType: bookingData.serviceType,
      appointmentStatus: "pending",
      appointmentNotes: bookingData.notes,
      appointmentProviderId: bookingData.provider.id,
    };

    try {
      const response = await axios.post("/api/appointments", {
        ...bookingDataToSubmit,
      });

      if (response.status === 201) {
        setBookingStatus("success");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      setSubmitError("Failed to confirm booking. Please try again.");
      setBookingStatus("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStage = (): boolean => {
    switch (currentStage) {
      case 1:
        return bookingData.serviceType === "";
      case 2:
        return (
          !bookingData.pet.name ||
          !bookingData.pet.type ||
          !bookingData.pet.age ||
          !bookingData.pet.typeId
        );
      case 3:
        return !bookingData.provider.id;
      case 4:
        return !bookingData.date;
      case 5:
        return !bookingData.time;
      case 6:
        return false;
      default:
        return false;
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
        return (
          <BookingStage2
            petTypes={petTypesInfo}
            onUpdateBookingData={updateBookingData}
            name={bookingData.pet.name}
            type={bookingData.pet.type}
            typeId={bookingData.pet.typeId}
            age={bookingData.pet.age}
          />
        );
      case 3:
        return (
          <BookingStage3
            serviceType={bookingData.serviceType}
            isLoading={staffLoading}
            isError={Boolean(staffError)}
            staff={staffInfo}
            onUpdateBookingData={updateBookingData}
            selectedStaffId={bookingData.provider.id}
          />
        );
      case 4:
        return (
          <BookingStage4
            onUpdateBookingData={updateBookingData}
            date={bookingData.date}
            schedules={providerSchedules}
          />
        );
      case 5:
        return (
          <BookingStage5
            onUpdateBookingData={updateBookingData}
            selectedTime={bookingData.time}
            providerId={bookingData.provider.id}
            date={bookingData.date}
          />
        );
      case 6:
        return (
          <BookingStage6
            bookingData={bookingData}
            onUpdateBookingData={updateBookingData}
          />
        );
      default:
        return null;
    }
  };

  if (bookingStatus === "loading") {
    return (
      <div className="flex items-center justify-center pt-96">
        <div className="loader2"></div>
      </div>
    );
  }

  if (bookingStatus === "success") {
    return (
      <div className="flex items-center justify-center pt-20">
        <Card className="text-center w-96 bg-card">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your appointment has been successfully scheduled. We&apos;ve sent
              a confirmation email with all the details.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left mb-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Appointment Type:
                </span>
                <p>{bookingData.serviceType}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Date &amp; Time:
                </span>
                <p>
                  {new Date(bookingData.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {formatSlotLabel(bookingData.time)}
                </p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Pet:
                </span>
                <p>{bookingData.pet.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Provider:
                </span>
                <p>{bookingData.provider.name}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button asChild>
              <Link
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                href="/appointments"
              >
                View All Appointments
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-card shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-3xl">Book a new appointment</CardTitle>
          <CardDescription className="text-lg">
            Follow the steps below to schedule an appointment for your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mt-4 h-2" />

          <div className="h-8" />

          {renderStep()}
        </CardContent>
        {submitError && (
          <div className="px-6 text-sm text-red-500">{submitError}</div>
        )}
        <CardFooter className="justify-between">
          {currentStage > 1 ? (
            <Button
              variant="outline"
              onClick={prevStage}
              disabled={currentStage === 1}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStage < 6 ? (
            <Button onClick={nextStage} disabled={validateStage()}>
              Next
            </Button>
          ) : (
            <Button
              onClick={onConfirmBooking}
              disabled={validateStage() || isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
