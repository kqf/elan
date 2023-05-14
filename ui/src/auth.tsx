import axios from "axios";
import { toast } from "react-toastify";

export function tokenHeader() {
  if (localStorage.getItem("accessToken") === null) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
}

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.resonse.status < 500;

  if (!expectedError) {
    toast.error("Unexpected error");
  }
});

async function get(url: string, redirect?: () => void) {
  const header = tokenHeader();
  if (header === null) {
    redirect && redirect();
    return;
  }

  const response = await axios.get(url, { headers: header });
  console.log("Fetching", url, response.data);
  return response;
}

async function post(url: string, data: any, redirect?: () => void) {
  const header = tokenHeader();
  if (header === null) {
    redirect && redirect();
    return;
  }

  const response = await axios.post(url, data, { headers: header });
  console.log("Fetching", url, response.data);
  return response;
}

const http = {
  get: get,
  post: post,
};
export default http;
