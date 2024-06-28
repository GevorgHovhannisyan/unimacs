// axios
import axios from 'axios'

const baseURL = process.env.VUE_APP_BACK

const instance = axios.create({
  baseURL,
  // headers: {
  //   'Authorization': localStorage.token
  // }
})

// export const setAuthHeader = (token) => {
//   instance.defaults.headers.common['Authorization'] = `${token}`;
// }
// setAuthHeader(localStorage.getItem('token'));



export default instance