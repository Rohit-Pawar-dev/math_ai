import axios from 'axios'

const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: 'https://math-ai.alphawizzserver.com:5001/api'
})

export default API;
