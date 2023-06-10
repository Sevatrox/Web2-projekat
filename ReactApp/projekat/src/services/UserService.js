import axios from "axios";
import { GetEmail, GetToken } from "../models/UserModel";

export const config =
{
    headers: {
        "Authorization" : `Bearer ${GetToken()}`
    }
};

export const AddUser = async (account) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/users/register', account);
}

export const LoginUser = async (account) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', account);
}

export const LoginGoogle = async (account) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/users/loginGoogle', account);
}

export const GetUserFromBackend = async () =>
{   
    const email = GetEmail();
    return await axios.get(process.env.REACT_APP_API_URL + '/api/users/' + email, config);
}

export const GetAllUsers = async () =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/users/all', config);
}

export const UpdateUser = async (id, account) =>
{
    return await axios.put(process.env.REACT_APP_API_URL + '/api/users/' + id, account, config);
}

export const GetUserById = async (id) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/users/id/' + id, config);
}