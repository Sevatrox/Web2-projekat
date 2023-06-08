import { config } from "./UserService";
import axios from "axios";


export const GetVerificationFromBackend = async (userId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/verifications/' + userId, config);
}