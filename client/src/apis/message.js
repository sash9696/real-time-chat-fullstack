import axios from "axios";

let url =  import.meta.env.VITE_API_URL;

const API = (token) => (
  axios.create({
    baseURL:url,
    headers:{Authorization:token}
  })
)

export const sendMessage = async (body) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).post('/api/message', body);
  
      return data
    } catch (error) {
      console.log("Error in sendMessage api", error);
    }
  };

  export const fetchMessages = async (id) => {
    try {
      const token = localStorage.getItem('userToken')
  
      const {data} = await API(token).get(`/api/message/${id}`);
  
      return data
    } catch (error) {
      console.log("Error in fetchMessages api", error);
    }
  };

