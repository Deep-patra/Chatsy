import Image from "next/image";
import classnames from "classnames";
import { type IMessage } from "@/context/chat.context";
import { IContact, IUser } from "@/context/auth.context";

interface IMessageProps {
  message: IMessage;
  self: boolean;
  author: IUser | IContact;
}

interface IProfilePictureProps {
  photoURL: string | null | undefined;
  self: boolean;
}

interface IImageSliderProps {
  images: string[];
}

interface ITextProps {
  text: string;
}

function ProfilePicture(props: IProfilePictureProps) {
  return (
    <div
      style={{ order: props.self ? 1 : 0 }}
      className="relative flex-shrink-0 rounded-full w-5 h-5 md:w-10 md:h-10 overflow-hidden"
    >
      <Image src={props.photoURL || "/user.png"} alt={""} fill />
    </div>
  );
}

function ImageSlider(props: IImageSliderProps) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {props.images.length > 0
        ? props.images.map((image, idx) => (
            <div className="relative w-[200px] h-[200px]" key={idx}>
              <Image
                src={image}
                alt={""}
                fill
                className="object-contain"
              />
            </div>
          ))
        : null}
    </div>
  );
}

function Text(props: ITextProps) {
  return (
    <div className="p-1">
      <p className="text-sm md:text-md text-white1">{props.text}</p>
    </div>
  );
}

export default function Message(props: IMessageProps) {
  const { text, images, time } = props.message;
  const { photoURL, name } = props.author;

  const messageTime = time.toLocaleTimeString()

  return (
    <div
      className={classnames(
        "w-full flex flex-row items-start",
        props.self ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex flex-row items-start p-2 gap-5">
        {/* Profile Picture */}
        <ProfilePicture {...{ photoURL, self: props.self }} />

        {/* Message */}
        <div
          style={{ order: self ? 0 : 1, minWidth: "200px", maxWidth: "450px" }}
          className="flex flex-col justify-start rounded-lg p-2 bg-black2 gap-2"
        >
          <span className="font-semibold text-sm md:text-md text-white2">
            {name}
          </span>
          <Text {...{ text }} />
          <ImageSlider {...{ images }} />
          <span className={classnames("text-[0.5rem] text-white3", self ? "ml-auto" : "mr-auto")}>{messageTime}</span>
        </div>
      </div>
    </div>
  );
}
