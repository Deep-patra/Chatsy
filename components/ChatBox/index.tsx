import Tabs from './tabs'
import ChatContainer from './chatContainer'
import MessageInputBox from './messageInputBox'
import { IContact } from '@/context/auth.context'
import Chat from '@/context/chat.context'

interface IChatBox {
  activeContact: IContact | null;
  openedContacts: IContact[];
  changeOpenedContacts: (contacts: IContact[]) => void;
  changeActiveContact: (contact: IContact | null) => void;
}

export default function Chatbox(props: IChatBox) {
  const { activeContact, openedContacts } = props
  
  return (
    <div className="chatbox p-2 md:m-5 md:rounded-2xl w-full max-h-full">
      
      <Tabs 
        activeUser={props.activeContact}
        users={props.openedContacts}
        setUsers={props.changeOpenedContacts}
        changeActiveUser={props.changeActiveContact}
      />

      <Chat.Consumer>
        {
          ({ chats, updateChats, changeChats }) => (
            <ChatContainer
              {...{
                openedContacts,
                activeContact,
                chats,
                changeChats,
                updateChats,
              }}
            />
          )
        }
      </Chat.Consumer>
      
      {activeContact && <MessageInputBox {...{ activeContact }} />}
    </div>
  )
}