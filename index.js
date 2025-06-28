// tech stack
//MERN
//Socket io
//Redux toolkit
//Tailwind css

//Features

// Real time chat => send and recieve messages in real time
// User authentication => signup login logout
//Group creation:  users can create some kind of room and invite other people to join
//Notifications: user can recieve notifications on new messages
//Emojis: users an send and recieve emojis in the messages
//Profile page to change avatar , display name etc
//Search functionality
//Responsive design

//user a -> Websocket/HTTP -> Chat Service -> Message Queue -> USerb
// rabbit mq
//kafka
//sqs
//redis streams

const original = {
  name: "John",
  address: {
    city: "Delhi",
    zip: 12345,
  },
};

const shallowCopy = { ...original };

//issue original.address and shallowCopy.address point to same obj

// const deepCopy = structuredClone(original);

// function deepClone(obj) {
//   if (obj == null || typeof obj !== "object") return obj;

//   if (Array.isArray(obj)) {
//     return obj.map(deepClone);
//   }

//   const clonedObj = {};

//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       clonedObj[key] = deepClone(obj[key]);
//     }
//   }

//   return clonedObj;
// }


// const deepCopied = cloneDeep(original); //import from loadash

// const deepCopy = {
//     ...original,
//     address:{
//         ...original.address,
//         coords:{
//             ...original.address.coords,
//         }
//     }
// }


//real time chat apps
//even customer support chats

//live financial data
//instant update updated on stock prices, crypto values, order books

//online gaming
//between two players synchronisation

//real time gps lcoation tracking


//Live streaming/ video conferencing

//live updates
//flash sales,
//real time stock updates
//price changes

//collabaritve tools

//google docs, figma 
//enables real time collaboration, cursor tracking, live editing , updates

//security and monitoring dashboards

// push alerts 

//IOT SMart devices
//sensor data, factory monitoring




