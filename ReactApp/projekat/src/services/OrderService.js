import axios from "axios";
import { config } from "./UserService";


export const CreateOrder = async (order) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/orders/create', order, config);
}