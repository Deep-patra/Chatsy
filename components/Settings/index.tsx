"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import Loader from "@/components/loader";
import Auth from "@/context/auth.context";
import ChangePfp from "./changePfp";
import ChangeName from "./changeName";
import EditContacts from "./editContacts";
import { useListenUser } from "@/hooks/listenUserDoc";

export default function Settings() {
  const router = useRouter();
  const { user } = useContext(Auth);

  const handleBack = () => {
    router.push("/home");
  };

  // listen to the user changes
  useListenUser()

  if (!user)
    return (
      <div className="w-full h-full flex flex-row items-center jusitfy-center">
        <div className="w-20 h-20 relative">
          <Loader color="white" />
        </div>
      </div>
    );

  return (
    <main className="w-full flex flex-col p-2 md:p-5">
      <div className="flex flex-row items-center py-2 px-1 gap-5">
        <button
          type="button"
          aria-label="back button"
          className="p-2 rounded-full w-10 h-10 text-white2 hover:text-white1 hover:bg-white3"
          onClick={handleBack}
        >
          <IoIosArrowBack className="text-xl text-inherit" />
        </button>

        <div className="flex flex-row items-center gap-2">
          <span className="w-8 h-8 text-white2 flex flex-row items-center justify-center">
            <FiSettings className="text-xl text-inherit" />
          </span>
          <span className="text-2xl text-white2 font-semibold">Settings</span>
        </div>
      </div>

      <div className="p-5 flex flex-col items-center md:flex-row md:items-start gap-32">
        <ChangePfp uid={user?.uid} photoURL={user?.photoURL} />
        <div className="flex-grow flex flex-col gap-10 max-w-[600px]">
          <ChangeName uid={user?.uid} name={user?.name} email={user?.email} />
          <EditContacts uid={user?.uid} contacts={user?.contacts} />
        </div>
      </div>
    </main>
  );
}
