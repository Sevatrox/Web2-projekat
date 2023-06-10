import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { LoginUser } from "../services/UserService";
import { SetEmail, SetRole, SetToken, userLoginModel } from "../models/UserModel";

import jwt from 'jwt-decode';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const history = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const validationErrors = {};

        if (!validateEmail(email)) {
          validationErrors.email = "Invalid email address.";
        }
        if (password.length < 3 || password.length > 20) {
          validationErrors.password = "Password must be between 3 and 20 characters.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const account = userLoginModel;
        account.email = email;
        account.password = password;    

        try{
            const response = await LoginUser(account);
            SetToken(response.data);
            SetRole(jwt(response.data));
            SetEmail(account.email);
            history("/");     
            window.location.reload(); 
        }
        catch(e){
            alert('Ne postoji account sa tim email i lozinkom! Pokusajte ponovo.');
            history("/login");
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    return ( 
        <div className="login">
            <h2>Prijavite se</h2>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label>Password: </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <Link to="/registracija">Ako nemate profil, pritisnite ovaj link za registraciju.</Link>
                <button>Log In</button>
            </form>
        </div>
     );
}
 
export default Login;