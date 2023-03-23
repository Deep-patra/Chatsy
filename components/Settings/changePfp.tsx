import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import UserService from "@/services/user.service";
import StorageService from "@/services/storage.service";
import Loader from "@/components/loader";

interface IChangePfp {
  uid: string;
  photoURL?: string | null;
}

export default function ChangePfp(props: IChangePfp) {
  const { uid, photoURL } = props

  const [newImage, changeImage] = useState<File | null>(null);
  const [loading, changeLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePicture = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleSave = async () => {
    if (newImage) {
      changeLoading(true);

      const image_url = await StorageService.storeImage(newImage).catch(
        console.error
      );

      if (image_url) {
        UserService.update(uid, { photoURL: image_url })
          .catch(console.error)
          .finally(() => {
            changeLoading(false); // change the loading to false
            changeImage(null); // reset the state
          });
      } else {
        changeLoading(false)
        changeImage(null)
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    if (target.files) {
      if (target.files[0]) changeImage(target.files[0]);
    }
  };

  return (
    <div className="flex flex-col p-2 gap-5">
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="w-0 h-0 hidden"
        onChange={handleFileChange}
      />

      <div className="relative rounded-full w-[200px] h-[200px] overflow-hidden">
        <Image
          src={
            newImage
              ? URL.createObjectURL(newImage)
              : photoURL || "/user.png"
          }
          alt="User"
          fill
        />
      </div>

      <div className="flex flex-row items-center gap-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          aria-label="Change profile picture"
          className="p-2 px-3 rounded-lg border border-solid border-white2 text-white2 hover:border-white1 hover:text-white1 active:bg-white1 active:text-black1 transition-colors"
          onClick={handleChangePicture}
        >
          Change Picture
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          aria-label="Save button"
          disabled={newImage ? false : true}
          className="p-2 px-3 rounded-lg border-green bg-green text-white1 hover:bg-transparent hover:text-green border border-solid disabled:bg-transparent disabled:border-white3 disabled:text-white3 disabled:cursor-not-allowed transition-colors"
          onClick={handleSave}
        >
          {loading ? (
            <div className="w-7 h-7 relative">
              <Loader color="green" />
            </div>
          ) : (
            "Save"
          )}
        </motion.button>
      </div>
    </div>
  );
}
