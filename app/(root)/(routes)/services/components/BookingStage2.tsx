"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingDataUpdater, PetTypeOption } from "@/types";

interface BookingStage2Props {
  petTypes: PetTypeOption[];
  onUpdateBookingData: BookingDataUpdater;
  name: string;
  type: string;
  typeId: string;
  age: number | undefined;
}

export function BookingStage2({
  petTypes,
  onUpdateBookingData,
  name,
  type,
  typeId,
  age,
}: BookingStage2Props) {
  return (
    <div className="">
      <div className="font-bold text-lg pb-7">Pet Information</div>
      <div className="flex flex-col w-md gap-4 w-[400px]">
        <Input
          className="bg-slate-100 dark:bg-neutral-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          type="text"
          placeholder="Pet Name"
          value={name}
          onChange={(e) =>
            onUpdateBookingData("pet", {
              name: e.target.value,
              type,
              typeId,
              age: age ?? 0,
            })
          }
        />
        <Select
          value={type}
          onValueChange={(value) => {
            const selectedPetType = petTypes.find(
              (petType) => petType.displayName === value,
            );

            if (!selectedPetType) return;

            onUpdateBookingData("pet", {
              name,
              type: value,
              typeId: selectedPetType.id,
              age: age ?? 0,
            });
          }}
        >
          <SelectTrigger className="w-[180px] bg-slate-100 dark:bg-neutral-950 text-black dark:text-white">
            <SelectValue placeholder="Pet Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {petTypes.map((petType) => (
              <SelectItem key={petType.id} value={petType.displayName}>
                {petType.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={age ? age.toString() : ""}
          onValueChange={(value) =>
            onUpdateBookingData("pet", {
              name,
              type,
              typeId,
              age: parseInt(value, 10),
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-100 dark:bg-neutral-950 text-black dark:text-white">
            <SelectValue placeholder="Age of Pet" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
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
