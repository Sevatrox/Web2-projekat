import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUser } from "../models/UserModel";
import { GetItem } from "../models/ItemModel";
import { UpdateItem } from "../services/ItemService";

const ChangeItem = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [pictureName, setPictureName] = useState('');
  const [picture, setPicture] = useState();
  const [errors, setErrors] = useState({});

  const history = useNavigate();

  useEffect ( () => {
    const item = GetItem();
    setId(item.id);
    setName(item.name);
    setPrice(item.price);
    setAmount(item.amount);
    setDescription(item.description);
    setPictureName(item.picture);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (name.length < 3 || name.length > 20) {
      validationErrors.name = "Item name must be between 3 and 20 characters.";
    }
    if (amount <= 0) {
      validationErrors.amount = "Amount can not be under 0.";
    }
    if (isNaN(amount)) {
      validationErrors.amount = "Amount has to be a number.";
    }
    if (price <= 0) {
      validationErrors.price = "Price can not be under 0.";
    }
    if (isNaN(price)) {
      validationErrors.price = "Price has to be a number.";
    }
    if (description.length < 3 || description.length > 30) {
      validationErrors.description = "Surname must be between 3 and 30 characters.";
    }
    if (pictureName === "") {
      validationErrors.pictureName = "Please select an article picture.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //const item = { name, price, amount, description, picture : pictureName, pictureFile : picture };
    const item = { name, price, amount, description, picture: pictureName, sellerId: GetUser().id };
    //console.log(item);
    try {
      const response = await UpdateItem(id, item);
      console.log(response.data);
      localStorage.removeItem('item');
      alert('Uspjesno ste izmjenili artikal!')
      history("/artikli");
    }
    catch (e) {
      alert('Desila se greska!');
    }
  }

  const handlePicture = (e) => {
    setPicture(e.target.files[0]);
    setPictureName(e.target.files[0].name);
  }

  return (
    <div className="add-item">
      <h2>Dodaj artikal</h2>
      <form onSubmit={handleSubmit}>
        <label>Naziv: </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error">{errors.name}</p>}
        <label>Cijena: </label>
        <input
          type="text"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className="error">{errors.price}</p>}
        <label>Kolicina: </label>
        <input
          type="text"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errors.amount && <p className="error">{errors.amount}</p>}
        <label>Opis: </label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="error">{errors.description}</p>}
        <label>Izaberite sliku za Vas artikal:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePicture(e)}
        />
        {errors.pictureName && <p className="error">{errors.pictureName}</p>}
        <button>Izmjeni</button>
      </form>
    </div>
  );
}

export default ChangeItem;