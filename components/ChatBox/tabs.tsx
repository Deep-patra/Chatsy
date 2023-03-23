import classnames from "classnames";
import { IContact } from "@/context/auth.context";
import { Reorder } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

interface ITabsProps {
  activeUser: IContact | null;
  users: IContact[];
  setUsers: (orderedUsers: any[]) => void;
  changeActiveUser: (contact: IContact | null) => void;
}

interface ITabItemProps<T> {
  contact: T;
  active: boolean;
  changeActiveUser: (contact: IContact) => void;
  removeItem: (contact: T) => void;
}

function TabItem(props: ITabItemProps<IContact>) {
  const { contact, removeItem } = props;

  return (
    <div
      className={classnames(
        "flex flex-row items-center rounded-md p-1 px-2 gap-3 cursor-grab",
        props.active ? "bg-black3" : "bg-black2"
      )}
    >
      <button
        type="button"
        aria-label="name"
        className="flex flex-row items-center"
        onClick={() => { props.changeActiveUser(contact) }}
      >
        <span className="text-white1 inline-block max-w-10 whitespace-nowrap text-ellipsis overflow-hidden">
          {contact.name}
        </span>
      </button>

      <button
        type="button"
        aria-label="Tab close button"
        className="p-1 rounded-md hover:bg-gray1 text-gray1 hover:text-white1"
        onClick={() => {
          removeItem(contact);
        }}
      >
        <RxCross2 className="w-4 h-4 text-inherit" />
      </button>
    </div>
  );
}

export default function Tabs(props: ITabsProps) {
  const { activeUser, setUsers } = props;

  const removeUser = (contact: IContact) => {
    const new_users = props.users.filter((user) => {
      if (user.uid === contact.uid) return;
      return user;
    });

    setUsers(new_users);
  };

  return (
    <div
      style={{ gridRowStart: 1, gridRowEnd: 2 }}
      className="w-full overflow-x-auto flex-row flex h-full"
    >
      {props.users.length > 0 && (
        <Reorder.Group
          axis="x"
          className="flex flex-row items-center gap-4"
          values={props.users}
          onReorder={props.setUsers}
        >
          {props.users.map((user, idx) => (
            <Reorder.Item key={idx} value={user}>
              <TabItem
                active={activeUser ? activeUser.uid === user.uid : false}
                contact={user}
                removeItem={removeUser}
                changeActiveUser={props.changeActiveUser}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
