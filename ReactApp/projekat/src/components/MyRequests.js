import { useEffect, useState } from "react";
import { GetItemsByOrderId } from "../services/ItemService";
import { GetUserById } from "../services/UserService";
import { GetUser } from "../models/UserModel";
import { GetPastOrdersBySellerId } from "../services/OrderService";

const MyRequests = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await GetPastOrdersBySellerId(GetUser().id);
            console.log(response.data);
            const ordersWithItems = [];
            for (const order of response.data) {
                const itemsResponse = await GetItemsByOrderId(order.id);

                const { buyerId } = order;
                try {
                    const buyerResponse = await GetUserById(buyerId);

                    const buyer = buyerResponse.data;
                    const updatedOrder = { ...order, buyer: buyer.username };
                    const orderWithItems = { ...updatedOrder, items: itemsResponse.data };
                    ordersWithItems.push(orderWithItems);
                } catch (error) {
                    console.error("Desila se greska:", error);
                    continue;
                }
            }
            setOrders(ordersWithItems);
        } catch (e) {
            alert("Desila se greska: " + e);
        }
    };
    return ( 
        <div className="past-requests-container">
        <div className="past-requests-content">
            { orders.length > 0 && <h2 className="past-requests-title">Stare porudzbine</h2>}
            {orders.length === 0 && <h2 className="past-requests-title">Nemate starih porudzbina!</h2>}
            {orders.length > 0 && orders.map((order) => (
                <div key={order.id}>
                    <table className="past-requests-table-order">
                        <thead>
                            <tr>
                                <th>Cijena</th>
                                <th>Komentar</th>
                                <th>Adresa</th>
                                <th>Vrijeme narudzbe</th>
                                <th>Vrijeme dostave</th>
                                <th>Kupac</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.price}</td>
                                <td>{order.comment}</td>
                                <td>{order.address}</td>
                                <td>{order.orderTime}</td>
                                <td>{order.orderArriving}</td>
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
 
export default MyRequests;