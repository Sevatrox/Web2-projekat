import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterFacebook = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const buyer = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        const account = { email, password, buyer };
    
        console.log(account);
    }

    return ( 
        <div className="register">
            <h2>Registracija putem Facebook-a</h2>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Lozinka: </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Link to="/registracija">Registruj se standardnim nacinom, putem ovog linka.</Link>
                <br/>
                <br/>
                <Link to="/login">Ako ste vec registrovani, pritisnite ovaj link za login.</Link>
                <br/>
                <button>Registruj se</button>
            </form>
        </div>
     );
}
 
export default RegisterFacebook;