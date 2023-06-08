import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import test from './test.png'
import { GetUser } from "../models/UserModel";
import { GetVerification } from "../models/VerificationModel";

const Profile = () => {

  const [user, setUser] = useState({
    id: -1,
    username: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    date: '',
    address: '',
    type: '',
    picture: '',
  });

  const [isSeller, setIsSeller] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const verification = GetVerification();

  useEffect(() => {
    const temp = GetUser();
    setUser(temp);
    if(user.type === "Prodavac")
    {
      setIsSeller(true)
      if(GetVerification() === "Accepted")
        setIsVerified(true);
      else
        setIsVerified(false);
    }  
  }, [user.type])

  /*
  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const response = await GetUserFromBackend();
    const temp = response.data;
    if (response.data.type === 1)
      temp.type = 'Kupac';
    else if (response.data.type === 2) {
      temp.type = 'Prodavac'
      setIsSeller(true);
      if(GetVerification() === "Accepted")
        setIsVerified(true);
      else
        setIsVerified(false);
      //CheckVerification(temp.id);
    }
    else
      temp.type = 'Admin';
    temp.password = (response.data.password).slice(0, 10).split('').map(() => '*').join('');
    setUser(temp);
    SetUser(temp);
  }
  */

  /*const CheckVerification = async(userId) => {
    const response = await GetVerificationFromBackend(userId);
    if(response.data.status === 0)
    {
      SetVerification('In process');
      setVerification('In process')
    }
    else if(response.data.status === 1)
    {
      SetVerification('Accepted');
      setVerification('Accepted')
    }
    else
    {
      SetVerification('Denied');
      setVerification('Denied')
    }
  }*/

  return (
    <div className="profile-container">
      <h2>Profil: </h2>
      <div className="profile-picture">
        <img src={test} alt="Profilna slika:" />
      </div>
      <div className="user-info">
        <div>
          <strong>Korisnicko ime:</strong> {user.username}
        </div>
        <div>
          <strong>Lozinka:</strong> {user.password}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Ime:</strong> {user.name}
        </div>
        <div>
          <strong>Prezime:</strong> {user.surname}
        </div>
        <div>
          <strong>Datum rodjenja:</strong> {user.date}
        </div>
        <div>
          <strong>Adresa:</strong> {user.address}
        </div>
        <div>
          <strong>Tip korisnika:</strong> {user.type}
        </div>
        {(!isSeller || isVerified) && <Link className="buttonProfile" to="/izmjenaProfila">Izmjena profila</Link>}
      </div>
      { isSeller &&
      <>
      <div className="verification-box">
        <h2>Verification status</h2>
        <p>{verification}</p>
      </div>
      </>}
    </div>
  );
}
 
export default Profile;