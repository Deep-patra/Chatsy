import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface IBottomOverlayProps {
  show: boolean;
  close: boolean;
  children: JSX.Element;
}

export default function BottomOverlay(props: IBottomOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const grow = {
    height: 300,
    display: "block",
  }

  const shrink = {
    height: 0,
    transitionEnd: {
      display: "none"
    }
  }

  return (
    <>
      {props.show ? (
        <>
          <div
            ref={overlayRef}
            className="fixed top-0 left-0 w-screen h-screen opacity-10"
          ></div>
          <motion.div animate={props.show ? grow : shrink}>
            {props.children}
          </motion.div>
        </>
      ) : null}
    </>
  );
}
