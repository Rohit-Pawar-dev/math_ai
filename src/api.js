import axios from 'axios'

const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: `${process.env.BASE_URL}/api`
})

export default API;
