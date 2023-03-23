import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

interface IImagePreviewProps {
  files: File[];
  handleFiles: (idx: number) => void;
}

interface IImagePreviewItemProps {
  idx: number;
  file: File;
  handleFiles: (idx: number) => void;
}

function ImagePreviewItem(props: IImagePreviewItemProps) {
  const [mouseOver, changeMouseOver] = useState<boolean>(false);
  return (
    <div
      key={props.idx}
      onPointerOver={() => {
        changeMouseOver(true);
      }}
      onPointerLeave={() => {
        changeMouseOver(false);
      }}
      className="z-30 h-[150px] min-w-[150px] max-w-[200px] relative rounded-md overflow-hidden border border-solid border-white3 p-5"
    >
      <Image
        src={URL.createObjectURL(props.file)}
        alt={""}
        fill
        className="object-contain"
      />
      <AnimatePresence>
        {mouseOver && (
          <motion.div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            className="z-30 absolute top-0 left-0 w-full h-full"
            initial={{ y: "-100%" }}
            animate={{ y: "0" }}
            exit={{ y: "-100%" }}
          >
            <button
              type="button"
              aria-label="Remove Image Button"
              className="absolute top-5 right-5 p-2 rounded-md text-white1"
              onClick={() => { props.handleFiles(props.idx) }}
            >
              <RxCross2 className="w-5 h-5 text-inherit"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ImagePreview(props: IImagePreviewProps) {
  return (
    <AnimatePresence>
      {props.files && (
        <motion.div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          className="absolute z-20 -top-5 left-0 -translate-y-full w-full p-2 overflow-y-hidden overflow-x-auto flex flex-row items-center gap-2 backdrop-blur-md"
          initial={{ height: "0" }}
          animate={{ height: "auto" }}
          exit={{ height: "0" }}
        >
          {props.files.map((file, idx) => (
            <ImagePreviewItem
              key={idx}
              {...{ file, idx, handleFiles: props.handleFiles }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
