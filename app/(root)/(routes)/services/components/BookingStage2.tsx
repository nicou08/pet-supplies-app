"use client";

import { useState, useEffect, use } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Pet = {
  id: string;
  name: string;
  type: string;
  age: string;
};

interface BookingStage2Props {
  onUpdateBookingData: (field: string, value: any) => void;
}

export function BookingStage2({ onUpdateBookingData }: BookingStage2Props) {
  const [petDetails, setPetDetails] = useState({
    name: "",
    type: "",
    age: "",
  });

  useEffect(() => {
    console.log("PETDETAULS", petDetails);
    if (petDetails.name && petDetails.type && petDetails.age) {
      // Call the function to update booking data
      onUpdateBookingData("pet", petDetails);
    }
  }, [petDetails]);

  return (
    <div className="">
      <div className="font-bold text-lg pb-7">Pet Information</div>
      <div className="flex flex-col w-md gap-4 w-[400px]">
        <Input
          type="text"
          placeholder="Pet Name"
          value={petDetails.name}
          onChange={(e) =>
            setPetDetails({ ...petDetails, name: e.target.value })
          }
        />
        <Select
          onValueChange={(value) =>
            setPetDetails({ ...petDetails, type: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pet Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dog">Dog</SelectItem>
            <SelectItem value="Cat">Cat</SelectItem>
            <SelectItem value="Guinea Pig">Guinea Pig</SelectItem>
            <SelectItem value="Rabbit">Rabbit</SelectItem>
            <SelectItem value="Bird">Bird</SelectItem>
            <SelectItem value="Fish">Fish</SelectItem>
            <SelectItem value="Reptile">Reptile</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setPetDetails({ ...petDetails, age: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Age of Pet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="7">7</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="11">11</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="13">13</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="17">17</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="19">19</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
