import { useEffect, useState } from "react";
import { GetItemsByOrderId } from "../services/ItemService";
import { calculateRemainingMinutes, GetNewOrdersBySellerId } from "../services/OrderService";
import { GetUser, userModel } from "../models/UserModel";
import { GetUserById } from "../services/UserService";
import { orderModel } from "../models/OrderModel";
import { itemModel } from "../models/ItemModel";
import { useNavigate } from "react-router-dom";

const NewRequestsSeller = () => {
    const [orders, setOrders] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let user = userModel;
            user = GetUser();
            const response = await GetNewOrdersBySellerId(user.id);
            let ordersResponse = [orderModel];
            ordersResponse = response.data;

            const ordersWithItems = [];
            for (const order of ordersResponse) {
                const itemsResponse = await GetItemsByOrderId(order.id);
                let itemsResponseModel = [itemModel];
                itemsResponseModel = itemsResponse.data;

                const { buyerId } = order;
                try {
                    const buyerResponse = await GetUserById(buyerId);
                    let buyerModel = userModel;
                    buyerModel = buyerResponse.data;

                    const updatedOrder = { ...order, buyer: buyerModel.username };
                    const orderWithItems = { ...updatedOrder, items: itemsResponseModel };
                    ordersWithItems.push(orderWithItems);
                } catch (error) {
                    if(error.response.status === 401 || error.response.status === 403)
                    {
                      localStorage.clear();
                      history('/');
                    }
                    console.error("Desila se greska:", error);
                    continue;
                }
            }
            setOrders(ordersWithItems);
        } catch (e) {
            if(e.response.status === 401 || e.response.status === 403)
            {
              localStorage.clear();
              history('/');
            }
            alert("Desila se greska: " + e);
        }
    };

    return ( 
        <div className="past-requests-container">
        <div className="past-requests-content">
            { orders.length > 0 && <h2 className="past-requests-title">Porudzbine u toku</h2>}
            {orders.length === 0 && <h2 className="past-requests-title">Nemate novih porudzbina!</h2>}
            {orders.length > 0 && orders.map((order) => (
                <div key={order.id}>
                    <table className="past-requests-table-order">
                        <thead>
                            <tr>
                                <th>Cijena</th>
                                <th>Komentar</th>
                                <th>Adresa</th>
                                <th>Status</th>
                                <th>Vrijeme narudzbe</th>
                                <th>Vrijeme kada stize narudzba</th>
                                <th>Vrijeme dostave</th>
                                <th>Kupac</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.price}</td>
                                <td>{order.comment}</td>
                                <td>{order.address}</td>
                                {(order.status === 0 && <td><label>U slanju</label></td>)}
                                {(order.status === 1 && <td><label>Dostavljeno</label></td>)}
                                <td>{order.orderTime}</td>
                                <td>{order.orderArriving}</td>
                                {(order.status === 1 && <td><label>0</label></td>)}
                                {(order.status === 0 && <td><label>{calculateRemainingMinutes(order)} minuta</label></td>)}
                                <td>{order.buyer}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="past-requests-table">
                        <thead>
                            <tr>
                                <th>Naziv</th>
                                <th>Cijena</th>
                                <th>Kolicina</th>
                                <th>Opis</th>
                                <th>Slika</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <img src={item.picture} alt={item.name} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <br />
                    <br />
                </div>
            ))}
        </div>
    </div>
     );
}
 
export default NewRequestsSeller;