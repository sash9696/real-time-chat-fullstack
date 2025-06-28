import Chat from "../models/chatModel.js";
import user from "../models/userModel.js";

//response structure common
//proper error loggin messages

export const accessChats = async (req, res) => {
  //1 on one chat
  const { userId } = req.body;

  if (!userId) res.send({ message: "Provide User's Id" });

  let chatExists = await Chat.find({
    isGroup: false,
    users: { $all: [userId, req.rootUserId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chatExists = await user.populate(chatExists, {
    path: "latestMessage.sender",
    select: "name email profilePic",
  });

  if (chatExists.length > 0) {
    res.status(200).send(chatExists[0]);
  } else {
    let data = {
      chatName: "sender",
      users: [userId, req.rootUserId],
      isGroup: false,
    };

    try {
      const newChat = await Chat.create(data);
      const chat = await Chat.find({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
};

export const fetchAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      // users:{$all:[a, b]},
      users:req.rootUserId
    })
      .populate("users")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });

    const finalChats = await user.populate(chats, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });

    res.status(200).json(finalChats);
  } catch (error) {
    console.log("Error fetching all chats: ", error);
    res.status(500).send({ error });
  }
};
export const createGroup = async (req, res) => {
  const { chatName, users } = req.body;

  if (!chatName || !users) {
    res.status(400).send({ message: "Please fill all the fields" });
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    res.send(400).send({ message: "Group should contain more than 2 users" });
  }

  try {
    const chat = await Chat.create({
      chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.rootUserId,
    });

    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.send(createdChat);
  } catch (error) {
    res.send(500).json({ error });
  }
};
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    res.status(400).send({ message: "Provide Chat id and Chat name" });
  }

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {$set: { chatName }},
      { new: true }
    )
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    if (!chat) res.status(404);

    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
export const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  const existing = await Chat.findOne({ _id: chatId });

  if (!existing.users.includes(userId)) {
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId },

    },
  {new:true})
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    if (!chat) res.status(404);

    res.status(200).send(chat);
  } else {
    res.status(409).json({ message: "User already exists" });
  }
};
export const removeFromGroup = async (req, res) => {
  // $pull: { users: userId },
  const { userId, chatId } = req.body;

  try {
    const existing = await Chat.findOne({ _id: chatId });

  if(!existing){
    return res.status(404).send({message:"Chat not found"})
  };

  if(existing.groupAdmin?.toString() === userId){
    return res.status(403).send({message:"You can't remove the group admin"})

  }

  // optional: Allow admin transfer before removal



  if (!existing.users.includes(userId)) {
    return res.status(409).send({message:"User does not exist in this group"})
  };


  console.log("existing", existing)

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {      $pull: { users: userId },
  },
  {new:true}
  ) .populate("groupAdmin", "-password")
  .populate("users", "-password");


  return res.status(200).send(updatedChat);
  } catch (error) {
      console.error('Error removing user from the group: ', error);

    return res.status(500).send({message:"Server error", error});

  }

  



};
