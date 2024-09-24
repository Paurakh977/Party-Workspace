import { Metadata } from "next";
import SignIn from "@/app/auth/signin/page";

export const metadata: Metadata = {
  title:
    "नेपाली काङ्ग्रेस अभियान एप",
};

export default function Home() {
  return (
    <SignIn />
  );
}
