import axios from 'axios'

const api = axios.create({
    baseURL: 'https://pit-smoker-backend.herokuapp.com'
})
export default api;