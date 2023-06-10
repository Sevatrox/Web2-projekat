import { useEffect, useState } from "react";
import { GetUser } from "../models/UserModel";
import { GetOrdersByBuyerId } from "../services/OrderService";
import { GetItemsByOrderId } from "../services/ItemService";
import { GetUserById } from "../services/UserService";

const PastRequests = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await GetOrdersByBuyerId(GetUser().id);

            const ordersWithItems = [];
            for (const order of response.data) {
                const itemsResponse = await GetItemsByOrderId(order.id);
                console.log(itemsResponse.data);

                const updatedItems = [];
                for (const item of itemsResponse.data) {
                    const { sellerId } = item;

                    try {
                        const sellerResponse = await GetUserById(sellerId);
                        const seller = sellerResponse.data;
                        const updatedItem = { ...item, seller: seller.username };
                        updatedItems.push(updatedItem);
                    } catch (error) {
                        console.error("Desila se greska:", error);
                        continue;
                    }
                }

                const orderWithItems = { ...order, items: updatedItems };
                ordersWithItems.push(orderWithItems);
            }
            setOrders(ordersWithItems);
        } catch (e) {
            alert("Desila se greska: " + e);
        }
    };

    const calculateRemainingMinutes = (order) => {
        const orderArrivingTime = new Date(order.orderArriving);
        const currentTime = new Date();
        const remainingTime = orderArrivingTime - currentTime;
        const remainingMinutes = Math.floor(remainingTime / 60000);
        return remainingMinutes;
    };

    const handleOtkazi = () => {

    };

    return (
        <div className="past-requests-container">
            <div className="past-requests-content">
                <h2 className="past-requests-title">Porudzbine</h2>
                {orders.map((order) => (
                    <div key={order.id}>
                        <table className="past-requests-table">
                            <thead>
                                <tr>
                                    <th>Cijena</th>
                                    <th>Komentar</th>
                                    <th>Adresa</th>
                                    <th>Status</th>
                                    <th>Vrijeme narudzbe</th>
                                    <th>Vrijeme kada stize narudzba</th>
                                    <th>Vrijeme dostave</th>
                                    <th>Otkazivanje narudzbe</th>
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
                                    <td>
                                        {order.cancel === 1 ? (
                                            <button className="past-requests-button" onClick={() => handleOtkazi()}>
                                                Otkazi
                                            </button>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Cijena</th>
                                    <th>Opis</th>
                                    <th>Slika</th>
                                    <th>Prodavac</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <img src={item.picture} alt={item.name} />
                                        </td>
                                        <td>{item.seller}</td>
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

export default PastRequests;