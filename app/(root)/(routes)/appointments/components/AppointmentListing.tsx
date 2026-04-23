"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAppointments } from "@/hooks/useAppointments";

import { AppointmentDisplay } from "@/types";

// Sample appointment data
const appointments = [
  {
    id: "1",
    petId: "1",
    petName: "Buddy",
    petImage: "/placeholder.svg?height=60&width=60&text=Buddy",
    type: "training",
    title: "Basic Obedience Training",
    date: "2025-01-15",
    time: "10:00 AM",
    duration: 60,
    status: "confirmed",
    provider: {
      id: "1",
      name: "Mike Peterson",
      image: "/placeholder.svg?height=40&width=40&text=Mike",
      phone: "(555) 123-4567",
      email: "mike@pettraining.com",
    },
    location: "Happy Paws Training Center",
    address: "123 Main St, Anytown, ST 12345",
    notes: "Focus on sit, stay, and come commands",
    price: 75.0,
  },
  {
    id: "2",
    petId: "2",
    petName: "Whiskers",
    petImage: "/placeholder.svg?height=60&width=60&text=Whiskers",
    type: "vet-visit",
    title: "Annual Checkup & Vaccinations",
    date: "2025-01-18",
    time: "2:30 PM",
    duration: 45,
    status: "confirmed",
    provider: {
      id: "2",
      name: "Dr. Sarah Johnson",
      image: "/placeholder.svg?height=40&width=40&text=Dr.+Johnson",
      phone: "(555) 987-6543",
      email: "sarah@vetclinic.com",
    },
    location: "City Veterinary Clinic",
    address: "456 Oak Ave, Anytown, ST 12345",
    notes: "Bring vaccination records",
    price: 120.0,
  },
  {
    id: "3",
    petId: "1",
    petName: "Buddy",
    petImage: "/placeholder.svg?height=60&width=60&text=Buddy",
    type: "grooming",
    title: "Full Grooming Service",
    date: "2025-01-22",
    time: "11:00 AM",
    duration: 90,
    status: "pending",
    provider: {
      id: "3",
      name: "Lisa Garcia",
      image: "/placeholder.svg?height=40&width=40&text=Lisa",
      phone: "(555) 456-7890",
      email: "lisa@pawsgrooming.com",
    },
    location: "Paws & Claws Grooming",
    address: "789 Pine St, Anytown, ST 12345",
    notes: "Include nail trimming and ear cleaning",
    price: 85.0,
  },
  {
    id: "4",
    petId: "3",
    petName: "Rex",
    petImage: "/placeholder.svg?height=60&width=60&text=Rex",
    type: "vet-visit",
    title: "Follow-up Examination",
    date: "2024-12-20",
    time: "3:00 PM",
    duration: 30,
    status: "completed",
    provider: {
      id: "2",
      name: "Dr. Sarah Johnson",
      image: "/placeholder.svg?height=40&width=40&text=Dr.+Johnson",
      phone: "(555) 987-6543",
      email: "sarah@vetclinic.com",
    },
    location: "City Veterinary Clinic",
    address: "456 Oak Ave, Anytown, ST 12345",
    notes: "Check healing progress on paw injury",
    price: 60.0,
  },
  {
    id: "5",
    petId: "2",
    petName: "Whiskers",
    petImage: "/placeholder.svg?height=60&width=60&text=Whiskers",
    type: "grooming",
    title: "Bath & Brush",
    date: "2024-12-15",
    time: "1:00 PM",
    duration: 60,
    status: "cancelled",
    provider: {
      id: "3",
      name: "Lisa Garcia",
      image: "/placeholder.svg?height=40&width=40&text=Lisa",
      phone: "(555) 456-7890",
      email: "lisa@pawsgrooming.com",
    },
    location: "Paws & Claws Grooming",
    address: "789 Pine St, Anytown, ST 12345",
    notes: "Cancelled due to pet illness",
    price: 45.0,
  },
];

const appointmentTypeInfo = {
  Training: {
    label: "Training",
    color: "bg-blue-100 text-blue-800",
    icon: "🏋️‍♂️",
  },
  Veterinary: {
    label: "Veterinary",
    color: "bg-green-100 text-green-800",
    icon: "🩺",
  },
  Grooming: {
    label: "Grooming",
    color: "bg-purple-100 text-purple-800",
    icon: "✂️",
  },
};

const statusInfo = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: X,
  },
};

export function AppointmentListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    appointments: userAppointments,
    isLoading: userAppointmentsLoading,
    isError: userAppointmentsError,
  } = useAppointments("");

  useEffect(() => {
    console.log("User appointments loaded:", userAppointments);
  }, [userAppointments]);

  // Filter appointments based on search and filters
  const filteredAppointments = (userAppointments || []).filter(
    (appointment: AppointmentDisplay) => {
      const matchesSearch =
        appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointmentType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.appointmentProvider.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || appointment.appointmentType === selectedType;
      const matchesStatus =
        selectedStatus === "all" ||
        appointment.appointmentStatus === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    }
  );

  // Categorize appointments
  const upcomingAppointments = filteredAppointments.filter(
    (apt: AppointmentDisplay) =>
      isAfter(apt.appointmentDate, new Date()) || isToday(apt.appointmentDate)
  );

  const pastAppointments = filteredAppointments.filter(
    (apt: AppointmentDisplay) =>
      isBefore(apt.appointmentDate, new Date()) && !isToday(apt.appointmentDate)
  );

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  if (userAppointmentsLoading) {
    return (
      <div className="flex items-center justify-center pt-96">
        <div className="loader2"></div>
      </div>
    );
  }
  if (userAppointmentsError) {
    return (
      <div className="flex items-center justify-center pt-96">
        <div>Error loading appointments</div>
      </div>
    );
  }

  const AppointmentCard = ({
    appointment,
  }: {
    appointment: AppointmentDisplay;
  }) => {
    const StatusIcon =
      statusInfo[appointment.appointmentStatus as keyof typeof statusInfo].icon;
    return (
      <div>
        {/* <div>
          Appointment for {appointment.petName} type{" "}
          {appointment.appointmentType} provider{" "}
          {appointment.appointmentProvider.name} on{" "}
          {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {appointment.appointmentTime} - {appointment.appointmentStatus}
        </div> */}

        <Card className="hover:shadow-md transition-shadow bg dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                {/* <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={appointment.petImage || "/placeholder.svg"}
                  alt={appointment.petName}
                  fill
                  className="object-cover"
                />
              </div> */}
                <div>
                  <h3 className="font-semibold text-lg">
                    {appointment.appointmentType}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    for {appointment.petName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    appointmentTypeInfo[
                      appointment.appointmentType as keyof typeof appointmentTypeInfo
                    ].color
                  }
                >
                  {
                    appointmentTypeInfo[
                      appointment.appointmentType as keyof typeof appointmentTypeInfo
                    ].label
                  }
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(appointment)}
                      className="cursor-pointer"
                    >
                      View Details
                    </DropdownMenuItem>
                    {appointment.appointmentStatus !== "completed" &&
                      appointment.appointmentStatus !== "cancelled" && (
                        <>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleCancelAppointment(appointment)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-neutral-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-neutral-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {appointment.appointmentTime}
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    statusInfo[
                      appointment.appointmentStatus as keyof typeof statusInfo
                    ].color
                  }
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {
                    statusInfo[
                      appointment.appointmentStatus as keyof typeof statusInfo
                    ].label
                  }
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {/* <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={appointment.provider.image || "/placeholder.svg"}
                  alt={appointment.appointmentProvider.name}
                  fill
                  className="object-cover"
                />
              </div> */}
                <span className="text-sm text-neutral-400">
                  Performed by: {appointment.appointmentProvider.name}
                </span>
              </div>

              <div className="flex items-start space-x-1 text-neutral-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  {/* <p className="font-medium">{appointment.location}</p>
                <p className="text-xs">{appointment.address}</p> */}
                  <p className="font-medium">Pet Supplies Inc.</p>
                  <p className="text-xs">123 Guinea Road, Anytown </p>
                </div>
              </div>

              {appointment.appointmentNotes && (
                <div className="bg-neutral-300 dark:bg-neutral-950 p-2 rounded text-sm">
                  <span className="font-medium">Notes: </span>
                  {appointment.appointmentNotes}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                {/* <span className="font-semibold">${appointment.price.toFixed(2)}</span> */}
                <div />
                <div className="flex items-center space-x-2">
                  {appointment.appointmentStatus !== "completed" &&
                    appointment.appointmentStatus !== "cancelled" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </>
                    )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-600">Manage your pet's appointments</p>
        </div>
        <Button asChild>
          <Link href="/services">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Link>
        </Button>
      </div>

      {/* Filters section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments, pets, or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Veterinary">Vet Visit</SelectItem>
                <SelectItem value="Grooming">Grooming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Appointment list Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No upcoming appointments
              </h3>
              <p className="text-gray-600 mb-4">
                Schedule your next appointment to keep your pet healthy and
                happy.
              </p>
              <Button asChild>
                <Link href="/services">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment: AppointmentDisplay) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
              <div className="h-20" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No past appointments
              </h3>
              <p className="text-gray-600">
                Your appointment history will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pastAppointments.map((appointment: AppointmentDisplay) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
              <div className="h-20" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment: AppointmentDisplay) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
              <div className="h-20" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
