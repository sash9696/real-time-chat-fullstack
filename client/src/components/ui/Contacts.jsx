import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setActiveChat } from '../../redux/chatsSlice';
import { getChatName, getChatPhoto, timeSince } from '../../utils';
// import NoContacts from './ui/NoContacts'

const aDay = 24 * 60 * 60 * 1000;

// Dummy functions
// const getChatName = (chat, activeUser) => chat.name || "Unknown Chat";
// const getChatPhoto = (chat, activeUser) => chat.photo || "https://via.placeholder.com/150";
// const timeSince = (date) => "2 hours ago"; // Placeholder

// Dummy data
const dummyActiveUser = {
  _id: "user123",
  name: "Dummy User",
};

const dummyChats = [
  {
    _id: "chat1",
    name: "John Doe",
    photo: "https://i.pravatar.cc/150?img=1",
    latestMessage: {
      message: "Hey, how are you doing today?",
    },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "chat2",
    name: "Jane Smith",
    photo: "https://i.pravatar.cc/150?img=2",
    latestMessage: {
      message: "Let’s catch up tomorrow!",
    },
    updatedAt: new Date().toISOString(),
  },
];

const dummyActiveChat = dummyChats[0]; // Assume first chat is selected

function Contacts() {

  const {chats,activeChat} = useSelector((state) => state.chats);

  const activeUser = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();

  console.log('aciveUser',{activeUser,chats,activeChat})

  useEffect(() => {
    // Normally you'd dispatch(fetchChats())
    console.log("Fetching chats...");
    dispatch(fetchChats())

  }, []);

  const handleSetActiveChat = (chat) => {
    console.log("Setting active chat:", chat);
    dispatch(setActiveChat(chat))
  };

  return (
    <div className='flex flex-col -space-y-1 overflow-y-scroll scrollbar-hide h-[87vh] pb-10'>
      {
        chats.length > 0 ? chats.map((e) => (
          <div
            onClick={() => handleSetActiveChat(e)}
            key={e._id}
            className={`flex items-center justify-between sm:gap-x-1 md:gap-x-1 mt-5 ${activeChat._id === e._id ? "bg-[#fafafa]" : "bg-[#fff]"} cursor-pointer py-4 px-2`}
          >
            <div className='flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3'>
              <img
                className='w-12 h-12 sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover'
                src={getChatPhoto(e, activeUser)}
                alt=""
              />
              <div>
                <h5 className='text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold'>
                  {getChatName(e, activeUser)}
                </h5>
                <p className='text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c]'>
                  {e.latestMessage?.message.length > 30
                    ? e.latestMessage?.message.slice(0, 30) + "..."
                    : e.latestMessage?.message}
                </p>
              </div>
            </div>
            <div className='flex flex-col items-end gap-y-[8px]'>
              <p className='text-[12.4px] sm:text-[12px] font-normal text-[#b0b2b3] tracking-wide'>
                {timeSince(new Date(Date.parse(e.updatedAt) - aDay))}
              </p>
            </div>
          </div>
        )) : (
          <p className='text-center text-gray-500 mt-10'>No Contacts Available</p>
          // <NoContacts />
        )
      }
    </div>
  );
}

export default Contacts;
