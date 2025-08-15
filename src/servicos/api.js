import axios from 'axios';

export const CadastroApi = axios.create({
    baseURL: "https://api-gerenciador-familiar.vercel.app"
})
export const LoginApi = axios.create({
    baseURL: "https://api-gerenciador-familiar.vercel.app"
})
export const TarefasApi = axios.create({
    baseURL: "https://api-gerenciador-familiar.vercel.app"
})
export const VeiculosApi = axios.create({
    baseURL: "https://api-gerenciador-familiar.vercel.app"
})