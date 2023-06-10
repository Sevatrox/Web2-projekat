import axios from "axios";
import { config } from "./UserService";


export const CreateOrder = async (order) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/orders/create', order, config);
}

export const GetOrdersByBuyerId = async (buyerId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/orders/' + buyerId, config);
}

export const DeleteOrder = async (id) =>
{   
    return await axios.delete(process.env.REACT_APP_API_URL + '/api/orders/' + id, config);
}