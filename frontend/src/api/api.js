import axios from "axios";
const api = axios.create({
  baseURL: "https://localhost:7205/api/", // URL de ton backend Django
  
});


{/*api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);*/}

export default  api ;