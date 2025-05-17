import { AppError } from '@utils/AppError'
import axios, { AxiosInstance } from 'axios'

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
    baseURL: 'http://192.168.1.10:3333',
})

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data) {
       // return Promise.reject(new AppError(error.response.message)) ❌
        return Promise.reject(new AppError(error.response.data.message)) // ✅ 

    } else {
        return Promise.reject(error)
    }
})
export { api }