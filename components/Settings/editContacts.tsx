import { useState } from "react";
import classnames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { IContact } from "@/context/auth.context";
import UserService from "@/services/user.service";
import Loader from "@/components/loader";
import { AiOutlineDelete } from "react-icons/ai";

interface IEditContacts {
  contacts: IContact[];
  uid: string;
}

interface IEditContactItem {
  active: boolean;
  contact: IContact;
  toggleSelection: (contact: IContact) => void;
}

interface IDeletePortal {
  itemsLength: number;
  loading: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}

function EditContactItem(props: IEditContactItem) {
  const { active, contact, toggleSelection } = props;
  return (
    <li className="p-2 flex flex-row items-center gap-5 rounded-lg hover:bg-black2 hover:text-white1 text-white2">
      <button
        type="button"
        className={classnames(
          "block w-4 h-4 rounded-full border border-solid cursor-pointer bg-transparent",
          active ? "bg-white2 border-white2" : "bg-transparent  border-white2"
        )}
        onClick={() => {
          toggleSelection(contact);
        }}
      ></button>
      <span className="text-xl text-inherit">{contact.name}</span>
    </li>
  );
}

function DeletePortal(props: IDeletePortal) {
  return (
    <motion.div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed top-0 left-0 w-screen h-screen z-[500] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8 p-5 rounded-lg bg-black2 shadow-md">
        <span className="text-lg text-white1">
          Delete {props.itemsLength} contacts.
        </span>

        <div className="flex flex-row items-center justify-end gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 px-2 text-base text-warning border border-solid border-warning bg-transparent hover:bg-warning hover:text-white1 rounded-md"
            onClick={() => {
              props.handleConfirmDelete();
            }}
          >
            {props.loading ? (
              <div className="w-8 h-8">
                <Loader color="red" />
              </div>
            ) : (
              "Delete"
            )}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 px-2 text-base text-white2 rounded-md border border-solid border-white2 bg-transparent hover:text-black1 hover:bg-white1 active:text-black1 active:bg-white1"
            onClick={() => {
              props.handleCancelDelete();
            }}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EditContacts(props: IEditContacts) {
  const { contacts } = props;

  const [loading, changeLoading] = useState<boolean>(false);
  const [openPortal, togglePortal] = useState<boolean>(false);
  const [selectedContacts, changeSelectedContacts] = useState<IContact[]>([]);

  const toggleSelection = (contact: IContact) => {
    const found = selectedContacts.findIndex(
      (value) => value.uid === contact.uid
    );

    if (found !== -1) {
      changeSelectedContacts([...selectedContacts.splice(found, 0)]);
      return;
    }

    changeSelectedContacts([...selectedContacts, contact]);
  };

  const isSelected = (contact: IContact): boolean => {
    const found = selectedContacts.find((value) => value.uid === contact.uid);
    return found ? true : false;
  };

  const handleDelete = () => {
    togglePortal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContacts.length > 0) {
      changeLoading(true); // loading = true

      const ids: string[] = selectedContacts.map((value) => value.uid);

      UserService.removeContact(props.uid, ids)
        .catch(console.error)
        .finally(() => {
          changeLoading(false); // loading = false
          togglePortal(false); // portal = false
          changeSelectedContacts([]); // selectedContacts = []
        });
    }
  };

  const handleCancelDelete = () => {
    togglePortal(false);
  };

  return (
    <>
      <div className="border border-solid border-white3 rounded-lg">
        <div className="flex flex-row items-center p-2 px-3 justify-between">
          <span className="text-xl text-white3">Contacts</span>
          <button
            type="button"
            aria-label="Delete button"
            disabled={selectedContacts.length === 0}
            className="p-2 rounded-full hover:bg-black2 text-warning disabled:text-white3 disabled:bg-transparent active:text-white1 active:bg-warning"
            onClick={handleDelete}
          >
            <AiOutlineDelete className="text-xl text-inherit" />
          </button>
        </div>

        <div className="relative p-2">
          <ul className="flex flex-col gap-2">
            {
              <>
                {
                  contacts.length === 0 && (
                    <div className="w-full flex flex-row items-center justify-center p-2">
                      <span className="text-white2">No Contacts!</span>
                    </div>
                )}
                {contacts.map((contact, idx) => (
                  <EditContactItem
                    key={idx}
                    {...{
                      contact,
                      toggleSelection,
                      active: isSelected(contact),
                    }}
                  />
                ))}
              </>
            }
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {openPortal && (
          <DeletePortal
            {...{
              itemsLength: selectedContacts.length,
              loading,
              handleCancelDelete,
              handleConfirmDelete,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
