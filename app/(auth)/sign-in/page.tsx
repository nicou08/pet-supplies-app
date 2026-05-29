import { PetIllustration } from "./components/PetIllustration";
import { SignInForm } from "./components/SignInForm";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-white dark:bg-card md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 md:px-12">
        <SignInForm />
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-[#FFE8DA] md:flex">
        <PetIllustration />
      </div>
    </div>
  );
}
