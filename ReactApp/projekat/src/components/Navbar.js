import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetEmail, GetRole, GetToken } from "../models/UserModel";
import { SetVerification } from '../models/VerificationModel';
import { GetVerificationFromBackend } from '../services/VerificationService';
import { GetUserFromBackend } from '../services/UserService';

const Navbar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(GetToken() !== null);
    const [role, setRole] = useState(GetRole());
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      setIsLoggedIn(GetToken() !== null);
      setRole(GetRole());
      if(role === "prodavac")
      {
        CheckVerification();
      }
    }, [role]);

    const CheckVerification = async(userId) => {
      const responseUser = await GetUserFromBackend(GetEmail());
      const response = await GetVerificationFromBackend(responseUser.data.id);
      if(response.data.status === 0)
      {
        SetVerification('In process');
        setIsVerified(false);
      }
      else if(response.data.status === 1)
      {
        SetVerification('Accepted');
        setIsVerified(true);
      }
      else
      {
        SetVerification('Denied');
        setIsVerified(false);

      }
    }

    return (
      <nav className="navbar">
        <h1>Online kupovina</h1>
        <div className="links">
          {isLoggedIn && <Link to="/">Home</Link>}
          {isLoggedIn && <Link to="/profil">Profil</Link>}
          {isLoggedIn && role === "kupac" && <Link to="/porudzbinaKupac">Nova porudzbina</Link>}
          {isLoggedIn && role === "kupac" && <Link to="/prethodnePorudzbine">Prethodne porudzbine</Link>}
          {isLoggedIn && role === "admin" && <Link to="/verifikacija">Verifikacija</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/novePorudzbineProdavac">Nove porudzbine</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/mojePorudzbine">Moje porudzbine</Link>}
          {isLoggedIn && role === "admin" && <Link to="/svePorudzbine">Sve porudzbine</Link>}
        </div>
      </nav>
    );
  };
 
export default Navbar;