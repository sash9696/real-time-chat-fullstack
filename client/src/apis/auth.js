import axios from "axios";

let url =  import.meta.env.VITE_API_URL;

const API = (token) => (
  axios.create({
    baseURL:url,
    headers:{Authorization:token}
  })
)

export const registerUser = async (body) => {
  console.log("registerUser");
  try {
    return await axios.post(`${url}/auth/register`, body);
  } catch (error) {
    console.log("Error in register api", error);
  }
};

export const loginUser = async (body) => {
  try {
    return await axios.post(`${url}/auth/login`, body);
  } catch (error) {
    console.log("Error in login api", error);
  }
};

export const validUser = async () => {
  try {
    const token = localStorage.getItem('userToken')

    const {data} = await API(token).get('/auth/valid',{
      headers:{Authorization:token}
    });

    return data
  } catch (error) {
    console.log("Error in valid user api", error);
  }
};


export const searchUsers = async (id) => {
  try {
    const token = localStorage.getItem('userToken')

    const {data} = await API(token).get(`/api/user?search=${id}`);

    console.log( 'searchUsers',data)
    return data
  } catch (error) {
    console.log("Error in valid user api", error);
  }
};

export const updateUser = async (id, body) => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).patch(`/api/users/update/${id}`, body);
    return data;
  } catch (error) {
    console.log('error in update user api');
    // toast.error('Something Went Wrong.try Again!');
  }
};

export const checkValid = async () => {
  try {
    const data = await validUser();

    if(!data?.user){
      window.location.href = '/login';
    }else{
      window.location.href = '/chats';
    }
  } catch (error) {
    console.log("Error in valid user api", error);
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    // Call logout API
    const { data } = await API(token).get('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('userToken');
    
    // Redirect to login page
    window.location.href = '/login';
    
    return data;
  } catch (error) {
    console.log("Error in logout api", error);
    // Even if API fails, clear local storage and redirect
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  }
};

