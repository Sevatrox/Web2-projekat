import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetAllItems } from '../services/ItemService';
import { GetUserById } from '../services/UserService';

const NewRequestBuyer = () => {
  const [items, setItems] = useState([]);
  const [itemsOrder, setItemsOrder] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await GetAllItems();
      const updatedItems = await getUsernames(response.data);
      const filteredItems = updatedItems.filter(item => item.amount > 0);

      setItems(filteredItems);
      setAmounts(Array(response.data.length).fill(1));
      setErrors(Array(response.data.length).fill(''));
    } catch (error) {
      console.error('Desila se greska:', error);
    }
  };

  const getUsernames = async (tempItems) => {
    const sellers = {};
  
    const updatedItems = [];
    for (const item of tempItems) {
      const { sellerId } = item;
  
      let sellerUsername;
      if (sellers.hasOwnProperty(sellerId)) {
        sellerUsername = sellers[sellerId];
      } else {
        try {
          const response = await GetUserById(sellerId);
          const seller = response.data;
          sellerUsername = seller.username;
          sellers[sellerId] = sellerUsername;
        } catch (error) {
          console.error('Desila se greska:', error);
          continue;
        }
      }
  
      const updatedItem = { ...item, prodavac: sellerUsername };
      updatedItems.push(updatedItem);
    }
  
    return updatedItems;
  };

  const handleDodaj = (item, amount, index) => {
    const validationErrors = {};
    if (amount <= 0) {
      validationErrors[index] = 'Kolicina ne moze biti manja od 1.';
    }
    if (amount > item.amount) {
      validationErrors[index] = 'Nema dovoljno proizvoda na stanju.';
    }
    if (isNaN(amount)) {
      validationErrors[index] = 'Kolicina mora biti broj.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors({ ...errors, ...validationErrors });
      return;
    }

    setErrors({ ...errors, [index]: '' });
  
    const updatedItems = [...items];
    updatedItems[index].amount -= amount;
    setItems(updatedItems);
  
    const updatedItemsOrder = [...itemsOrder];
    const updatedItem = { ...item, amount };
    updatedItemsOrder.push(updatedItem);
    setItemsOrder(updatedItemsOrder);

  };

  //console.log(itemsOrder);

  return (
    <div className="new-request-buyer-container">
      <div className="new-request-buyer-content">
        <h2 className="new-request-buyer-title">Artikli</h2>
        <table className="new-request-buyer-table">
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Cijena</th>
              <th>Kolicina</th>
              <th>Opis</th>
              <th>Slika</th>
              <th>Prodavac</th>
              <th>Kolicina</th>
              <th>Dodaj u korpu</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
                <td>{item.description}</td>
                <td>{item.picture}</td>
                <td>{item.prodavac}</td>
                <td>
                  <input
                    type="number"
                    value={amounts[index]}
                    onChange={(e) => {
                      const updatedAmounts = [...amounts];
                      updatedAmounts[index] = parseInt(e.target.value, 10);
                      setAmounts(updatedAmounts);
                    }}
                  />
                  {errors[index] && <p className="error">{errors[index]}</p>}
                </td>
                <td>
                  <button className="new-request-buyer-button" onClick={() => handleDodaj(item, amounts[index], index)}>
                    Dodaj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Link className="new-request-buyer-button" to={`/napraviPorudzbinu/${encodeURIComponent(JSON.stringify(itemsOrder))}`}>Korpa</Link>
      </div>
    </div>
  );
};

export default NewRequestBuyer;
