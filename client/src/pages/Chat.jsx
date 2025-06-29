import { useEffect, useState } from 'react';
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import MessageHistory from '../components/MessageHistory';
import Typing from '../components/ui/Typing';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Loading from '../components/ui/Loading';
import { getChatName } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client"; // commenting socket for now
import { fetchMessages, sendMessage } from '../apis/message';
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import { logoutUser } from '../apis/auth';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// const ENDPOINT = process.env.REACT_APP_SERVER_URL;

const ENDPOINT = 'http://localhost:3000/';
let socket, selectedChatCompare;


function Chat(props) {
  // Dummy active user

  const {activeUser} = props;
  const {activeChat, notifications}  = useSelector((state) => state.chats);
  // const {activeUser}  = useSelector((state) => state.activeUser);

  console.log('Chat',{activeChat,activeUser})

  // const activeUser = {
  //   name: "Sahil Chopra",
  //   profilePic: "https://i.pravatar.cc/150?img=12"
  // };

  // Dummy active chat
  // const activeChat = {
  //   _id: "dummy_chat_id",
  //   isGroup: false,
  //   users: [{ name: "Sahil" }, { name: "Alice" }],
  //   chatName: "Alice"
  // };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
   ]);

  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout Successful!");
    } catch (error) {
      console.log("Logout error:", error);
      toast.error("Logout failed, but you've been logged out locally");
    }
  };

  // setup a new socket connection from the client

useEffect(() => {
   if (!activeUser) {
     console.log('No active user, skipping socket setup');
     return;
   }

   socket = io(ENDPOINT);

   console.log('setup',{activeUser})
   socket.emit('setup', activeUser);

   socket.on("connected", () => {
    console.log('Socket connected successfully');
    setSocketConnected(true);
   });

   socket.on("connect_error", (error) => {
    console.error('Socket connection error:', error);
   });

   socket.on("typing", () => setIsTyping(true));

   socket.on("stop typing", () => setIsTyping(false));

   socket.on('message received', (newMessageRecieved) => {
    console.log('Message received via socket:', {newMessageRecieved,notifications })

    if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatId._id){
      console.log('Message is for a different chat, not updating current chat');
      if(!notifications.includes(newMessageRecieved)){
        dispatch(setNotifications([newMessageRecieved,...notifications]))
      }
      //send some notifications
    }else{
      console.log('Adding message to current chat');
      setMessages((prev) => ([...prev, newMessageRecieved]))
    }

    dispatch(fetchChats());
  });

   return () => {
    console.log('Disconnecting socket');
    socket.disconnect();
   }
}, [activeUser])


useEffect(() => {
  const fetchMessagesFunc = async () => {

    if(activeChat && socketConnected){
      setLoading(true);

      const data = await fetchMessages(activeChat._id);
      setMessages(data)
      console.log('Joining chat room:', activeChat._id);
      socket.emit('join room', activeChat._id)
      setLoading(false);

    }
  }
  fetchMessagesFunc();
  selectedChatCompare  = activeChat;
}, [activeChat, socketConnected])




  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && message && socketConnected) {
      // const newMessage = {
      //   _id: Date.now(),
      //   sender: activeUser,
      //   message
      // };

      socket.emit("stop typing", activeChat._id);

      const data = await sendMessage({chatId:activeChat._id, message})
      console.log('Message sent to server, broadcasting via socket:', data);

      socket.emit('new message', data)
      setMessages([...messages, data]);
      setMessage("");
      dispatch(fetchChats());
    }
  };




  if (loading) {
    return <div className={props.className}><Loading /></div>;
  }

  return (
    <>
      {
        activeChat ?
          <div className={props.className}>
            <div className='flex justify-between items-center px-5 bg-[#ffff] w-[100%]'>
              <div className='flex items-center gap-x-[10px]'>
                <div className='flex flex-col items-start justify-center'>
                  <h5 className='text-[17px] text-[#2b2e33] font-bold tracking-wide'>
                    {getChatName(activeChat, activeUser)}
                  </h5>
                </div>
              </div>
              <div className='flex items-center gap-x-2'>
                <Model />
                <button 
                  onClick={handleLogout}
                  className='flex items-center gap-x-1 text-[#e44d4d] hover:text-[#c73e3e] transition-colors'
                >
                  <IoMdLogOut className='w-[20px] h-[20px]' />
                  <span className='text-sm font-medium'>Logout</span>
                </button>
              </div>
            </div>

            <div className='scrollbar-hide w-[100%] h-[70vh] md:h-[66vh] lg:h-[69vh] flex flex-col overflow-y-scroll p-4'>
              <MessageHistory typing={isTyping} messages={messages} />
              {isTyping && <Typing width="100" height="100" />}
            </div>

            <div className='absolute left-[31%] bottom-[8%]'>
              {showPicker && <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />}

              <div className='border-[1px] border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] h-[50px] lg:w-[400px] rounded-t-[10px]'>
                <form onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
                  <input
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if(!socketConnected) return;

                      if(!typing){
                        setTyping(true);
                        socket.emit('typing', activeChat._id);

                        let lastTime = new Date().getTime();
                        let time = 3000;

                        setTimeout(() => {
                          let timeNow = new Date().getTime();

                          let timeDiff = timeNow - lastTime;

                          if(timeDiff >= time && typing){
                            socket.emit('stop typing', activeChat._id);
                            setTyping(false);

                          }
                        }, time)
                      }
                    }}
                    className='focus:outline-0 w-[100%] bg-[#f8f9fa]'
                    type="text"
                    name="message"
                    placeholder="Enter message"
                    value={message}
                  />
                </form>
              </div>

              <div className='border-x-[1px] border-b-[1px] bg-[#f8f9fa] border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] lg:w-[400px] rounded-b-[10px] h-[50px]'>
                <div className='flex justify-between items-start'>
                  <div className='cursor-pointer' onClick={() => setShowPicker(!showPicker)}>
                    {showPicker ? <BsFillEmojiSmileFill className='w-[20px] h-[20px] text-[#ffb02e]' /> : <BsEmojiSmile className='w-[20px] h-[20px]' />}
                  </div>
                  <button
                    onClick={(e) => keyDownFunction(e)}
                    className='bg-[#f8f9fa] border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-[#9e9e9e] font-medium rounded-[7px] -mt-1'>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          :
          <div className={props.className}>
            <div className='relative'>
              <div className='absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3'>
                <img className='w-[50px] h-[50px] rounded-[25px]' alt="User profile" src={activeUser?.profilePic || "https://i.pravatar.cc/150?img=12"} />
                <h3 className='text-[#111b21] text-[20px] font-medium tracking-wider'>
                  Welcome <span className='text-[#166e48] text-[19px] font-bold'>{activeUser?.name}</span>
                </h3>
              </div>
            </div>
          </div>
      }
    </>
  );
}

Chat.propTypes = {
  className: PropTypes.string,
  activeUser: PropTypes.shape({
    name: PropTypes.string,
    profilePic: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default Chat;
