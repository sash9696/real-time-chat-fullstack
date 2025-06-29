import axios from "axios";

let url =  import.meta.env.VITE_API_URL;

const API = (token) => (
  axios.create({
    baseURL:url,
    headers:{Authorization:token}
  })
)

export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    return data;
  } catch (error) {
    console.log('error in remove user api');
  }
};
  export const accessCreate = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).post('/api/chat',body);
  
      return data
    } catch (error) {
      console.log("Error in access create api", error);
    }
  };



  export const fetchAllChats = async () => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).get('/api/chat');
  
      return data
    } catch (error) {
      console.log("Error in fetchAllChats api", error);
    }
  };
  
  


  export const createGroup = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).post('/api/chat/group', body);
  
      return data
    } catch (error) {
      console.log("Error in create group api", error);
    }
  };
  

  export const renameGroup = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).patch('/api/chat/group/rename', body);
  
      return data
    } catch (error) {
      console.log("Error in rename group api", error);
    }
  };
  
  export const addToGroup = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).patch('/api/chat/groupAdd', body);
  
      return data
    } catch (error) {
      console.log("Error in add to group api", error);
    }
  };

  export const removeFromGroup = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).patch('/api/chat/groupRemove', body);
  
      return data
    } catch (error) {
      console.log("Error in remove from group api", error);
    }
  };