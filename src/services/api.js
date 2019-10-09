import axios from 'axios'

const api = axios.create({
    baseURL: 'https://pit-smoker-backend.herokuapp.com:3333'
})
export default api;