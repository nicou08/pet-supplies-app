import { redirect } from "next/navigation";

export default function ToysPage() {
  redirect("/shop?productType=toys");
}
