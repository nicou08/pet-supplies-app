import { redirect } from "next/navigation";

export default function FoodPage() {
  redirect("/shop?productType=food");
}
