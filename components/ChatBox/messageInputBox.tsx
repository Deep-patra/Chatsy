import {
  useState,
  useRef,
  useContext,
  type FormEventHandler,
  type MouseEvent,
} from "react";
import classnames from "classnames";
import { motion } from "framer-motion";
import { BsImage } from "react-icons/bs";
import { RiSendPlane2Line, RiSendPlane2Fill } from "react-icons/ri";
import ImagePreview from "./imagePreview";
import Auth from '@/context/auth.context'
import { type IContact } from "@/context/auth.context";
import ContactService from '@/services/contact.service'
import ChatService, { MessageGroup } from "@/services/chat.service";

interface IMessageInputBoxProps {
  activeContact: IContact;
}

interface IMessageInputProps {
  activeContact: IContact;
}

interface ISendButtonProps {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

function SendButton(props: ISendButtonProps) {
  const [focus, changeFocus] = useState<boolean>(false);

  return (
    <motion.button
      type="button"
      aria-label="Send button"
      whileTap={{ scale: 0.92 }}
      onMouseOver={() => {
        changeFocus(true);
      }}
      onMouseLeave={() => {
        changeFocus(false);
      }}
      onClick={(event) => {
        props.handleClick(event);
      }}
      className="w-9 h-9 p-1 rounded-full hover:bg-black2 flex flex-row items-center justify-center text-white2 hover:text-white1"
    >
      {focus ? (
        <RiSendPlane2Fill className="w-7 h-7 text-inherit" />
      ) : (
        <RiSendPlane2Line className="w-7 h-7 text-inherit" />
      )}
    </motion.button>
  );
}

function MessageInput(props: IMessageInputProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [text, changeText] = useState<string>("");
  const [files, changeFiles] = useState<File[]>([]);
  const [focus, changeFocus] = useState<boolean>(false);

  const { user } = useContext(Auth)

  const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    changeText(target.value);
  };

  const handleImageChange: FormEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    const inputFiles = [];

    if (!target.files) {
      changeFiles([]);
      return;
    }

    for (let i = 0; i < target.files.length; i++) {
      if (i > 2) return;

      const file = target.files[i];
      inputFiles.push(file);
    }

    changeFiles(inputFiles);
  };

  const handleFiles = (idx: number) => {
    const filterfiles = files.filter((file, _idx) => {
      if (idx === _idx) return;
      return file;
    });

    changeFiles(filterfiles);
  };

  const reset = () => {
    changeText("");
    changeFiles([]);
  };

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    if (text === "" && files.length === 0) return;

    (event.target as HTMLButtonElement).disabled = true;

    const { activeContact } = props
    user && ChatService.addMessage(activeContact.messageGroupId, user?.uid, text, files);

    (event.target as HTMLButtonElement).disabled = false;

    // reset the fields
    reset()
  };

  return (
    <div className="relative flex flex-row items-center w-full gap-2">
      { files.length > 0 && <ImagePreview {...{ files, handleFiles }} />}

      <div
        className={classnames(
          "max-w-full flex-grow px-2 flex flex-row items-center rounded-md gap-2 border border-solid transition-colors",
          focus ? "border-white1" : "border-white3"
        )}
      >
        {/**Image file Input */}
        <input
          ref={imageInputRef}
          type="file"
          onChange={handleImageChange}
          max="3"
          multiple
          accept="image/*"
          className="hidden w-0 h-0"
        />

        <input
          value={text}
          autoFocus
          placeholder="Type Something ..."
          className="w-full flex-grow text-base text-white1"
          onChange={handleInput}
          onFocus={() => {
            changeFocus(true);
          }}
          onBlur={() => {
            changeFocus(false);
          }}
        />

        <motion.button
          type="button"
          aria-label="select image button"
          whileTap={{ scale: 0.95 }}
          className="hover:bg-black3 p-2 ml-auto text-white2 hover:text-white1 rounded-full disabled:text-white3 disabled:cursor-not-allowed"
          onClick={() => {
            imageInputRef.current?.click();
          }}
        >
          <BsImage className="w-5 h-5 text-inherit" />
        </motion.button>
      </div>

      <SendButton handleClick={handleSend} />
    </div>
  );
}

export default function MessageInputBox(props: IMessageInputBoxProps) {
  const { activeContact } = props

  return (
    <div
      style={{ gridRowStart: 3, gridRowEnd: 4 }}
      className="relative w-full flex flex-row items-end gap-2"
    >
      <MessageInput {...{ activeContact }} />
    </div>
  );
}
