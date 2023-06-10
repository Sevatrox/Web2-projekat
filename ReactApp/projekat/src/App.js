import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import Profile from './components/Profile';
import NewRequestBuyer from './components/NewRequestBuyer';
import PastRequests from './components/PastRequests';
import Verification from './components/Verification';
import NewRequestsSeller from './components/NewRequestsSeller';
import MyRequests from './components/MyRequests';
import AllRequests from './components/AllRequests';
import Register from './components/Register';
import Login from './components/Login';
import RegisterGmail from './components/RegisterGmail';
import ProfileChange from './components/ProfileChange';
import Items from './components/Items';
import AddItem from './components/AddItem';
import ChangeItem from './components/ChangeItem';
import MakeRequest from './components/MakeRequest';
import EmptyRequest from './components/EmptyRequest';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registracija" element={<Register />} />
            <Route path="/registracijaGmail" element={<RegisterGmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/izmjenaProfila" element={<ProfileChange />} />
            <Route path="/artikli" element={<Items />} />
            <Route path="/noviArtikal" element={<AddItem />} />
            <Route path="/izmjenaArtikla" element={<ChangeItem />} />
            <Route path="/porudzbinaKupac" element={<NewRequestBuyer />} />
            <Route path="/napraviPorudzbinu/:items" element={<MakeRequest />} />
            <Route path="/napraviPorudzbinu/[]" element={<EmptyRequest />} />
            <Route path="/prethodnePorudzbine" element={<PastRequests />} />
            <Route path="/verifikacija" element={<Verification />} />
            <Route path="/novePorudzbineProdavac" element={<NewRequestsSeller />} />
            <Route path="/mojePorudzbine" element={<MyRequests />} />
            <Route path="/svePorudzbine" element={<AllRequests />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;