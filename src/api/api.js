import axios from 'axios'

const api = axios.create({
baseURL: 'http://tamizhy.smartprosoft.com/appdev/',
});

export default api