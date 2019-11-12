import axios from 'axios'
// 'http://192.168.0.104:3333'
const api = axios.create({
    baseURL: 'https://pit-smoker-backend.herokuapp.com'
})
export default api;