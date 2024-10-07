import { Metadata } from "next";
import ImageFetchLoader from "@/components/ImageFetchLoader";
import ProfileComponent from "@/components/Profile/Profile";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Profile = () => {
  return <ProfileComponent />;
};

export default Profile;
