import {
  useState,
  useEffect,
  useRef,
  useContext,
  type FormEventHandler,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { BsPersonAdd } from "react-icons/bs";
import Auth, { IContact, IUser } from "@/context/auth.context";
import ContactService from "@/services/contact.service";
import Loader from '@/components/loader'

interface IAddContactsProps {
  open: boolean;
}

interface ISearchInputProps {
  value: string;
  handleChange: (value: string) => void;
}

interface ISearchResultsProps {
  items: ISearchResultItem[];
  contacts: IContact[];
  user: IUser | null;
}

interface ISearchResultItem {
  name: string;
  photoURL: string;
  uid: string;
}

const SearchInput = (props: ISearchInputProps) => {
  const inputHandler: FormEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    props.handleChange(target.value);
  };

  return (
    <div className="flex flex-row items-center gap-2 rounded-md bg-black3 p-1">
      <BiSearch className="flex-shrink-0 w-5 h-5 text-white2" />
      <input
        type="text"
        className="flex-grow-1 w-full text-base text-white1"
        value={props.value}
        placeholder="Search"
        autoFocus
        onInput={inputHandler}
      />

      <button
        type="button"
        aria-label="Reset value"
        className="p-1 ml-auto text-white2 hover:bg-black3 hover:text-white1"
        onClick={() => {
          props.handleChange("");
        }}
      >
        <RxCross2 className="flex-shrink-0 w-5 h-5 text-inherit" />
      </button>
    </div>
  );
};

const SearchResults = (props: ISearchResultsProps) => {
  const [loading, changeLoading] = useState<boolean>(false)


  const alreadyExists = (uid: string): boolean => {
    const contact = props.contacts.find((value) => value.uid === uid);
    return contact ? true : false;
  };

  const handleAddContact = (uid: string) => {
    if (props.user) {
      changeLoading(true)
      ContactService.addContact(props.user.uid, uid)
      .catch(console.error)
      .finally(() => { changeLoading(false) })
    }
  }

  return (
    <div className="flex flex-col gap-3 py-3">
      {props.items.length === 0 && (
        <div className="w-full py-5 flex flex-row items-center justify-center text-white3">
          No Results !
        </div>
      )}

      {props.items.length > 0 &&
        props.items.map((item, idx) => (
          <div
            key={idx}
            className="relative hover:bg-black3 w-full flex flex-row items-center p-2 rounded-md gap-2"
          >
            {/* Profile Picture */}
            <div className="relative rounded-full border border-solid border-white3 w-10 h-10 bg-gray1 overflow-hidden">
              <Image src={item.photoURL || "/user.png"} alt={""} fill />
            </div>

            {/* Name */}
            <span className="w-20 whitespace-nowrap text-ellipsis overflow-hidden text-white1">
              {item.name}
            </span>

            {/* Add Contact Button */}
            {!alreadyExists(item.uid)  && (
                !loading ? (
                  <button
                  type="button"
                  aria-label="Add Contact button"
                  title={`Add ${item.name} to Contacts`}
                  className="ml-auto p-2 hover:bg-black3 rounded-full text-white2 hover:text-green"
                  onClick={() => {
                    handleAddContact(item.uid);
                  }}
                >
                  <BsPersonAdd className="w-6 h-6 text-inherit" />
                </button>
                ): (
                  <div className="w-5 h-5 relative">
                    <Loader color="white" />
                  </div>
                )              
            )}
          </div>
        ))}
    </div>
  );
};

export default function AddContacts(props: IAddContactsProps) {
  const [value, changeValue] = useState<string>("");
  const [searchResults, changeSearchResults] = useState<ISearchResultItem[]>(
    []
  );

  const { user } = useContext(Auth);

  const timeIDRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    type ReturnType = { uid: string; name: string; photoURL: string }[];
    async function GetSearchResults(value: string): Promise<ReturnType> {
      let results: any[] | void = [];
      results = await ContactService.search(value).catch(console.error);
      return results || [];
    }

    if (value !== "") {
      timeIDRef.current = setTimeout(() => {
        GetSearchResults(value).then((items) => {
          changeSearchResults(items);
        });
      }, 2000);
    } else changeSearchResults([]);

    return () => {
      timeIDRef.current && clearTimeout(timeIDRef.current);
    };
  }, [value]);

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          className="flex flex-col py-2 px-1 border-b border-b-solid border-white3 overflow-hidden"
          initial={{ height: "0" }}
          animate={{ height: "auto" }}
          exit={{ height: "0" }}
        >
          <SearchInput value={value} handleChange={changeValue} />

          <SearchResults
            items={searchResults}
            contacts={user ? user.contacts : []}
            user={user}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
