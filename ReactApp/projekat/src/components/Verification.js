import React, { useState, useEffect } from 'react';
import { GetAllVerifications, UpdateVerification } from '../services/VerificationService';
import { GetAllUsers } from '../services/UserService';
import emailjs from '@emailjs/browser';

const Verification = () => {
  const [verifications, setVerifications] = useState([]);
  const [sellers, setSellers] = useState([]);


  useEffect(() => {
    getVerifications();
    getSellers();
  }, []);

  const getVerifications = async () =>{
    const response = await GetAllVerifications();
    const transformedData = response.data.map(item => {
        let status = '';

        if (item.status === 0) {
          status = 'In process';
        } else if (item.status === 1) {
          status = 'Accepted';
        } else if (item.status === 2) {
          status = 'Denied';
        }

        return {
          id: item.id,
          userId: item.userId,
          status: status
        };
      });

    setVerifications(transformedData)
  }

  const getSellers = async () => {
    const response = await GetAllUsers();
    const temp = response.data.map(user => ({
      ...user,
      password: user.password.slice(0, 10).split('').map(() => '*').join('')
    }));
    setSellers(temp);
  };

  const handleAccept = async (verificationId, sellerEmail) => {
    const updatedVerifications = { userId : 0, status : 1 }
    const response = await UpdateVerification(verificationId, updatedVerifications);
    updateVerifications(verificationId, response.data.status);
    sendEmail("Vas nalog je prihvacen. Sada mozete koristiti funkcionalnosti nase stranice.", sellerEmail)
  };

  const handleDeny = async (verificationId, sellerEmail) => {
    const updatedVerifications = { userId : 0, status : 2 }
    const response = await UpdateVerification(verificationId, updatedVerifications);
    updateVerifications(verificationId, response.data.status);
    sendEmail("Vas nalog je odbijen i nazalost ne mozete koristiti funkcionalnosti nase stranice.", sellerEmail)
  };

  const updateVerifications = (verificationId, newStatus) => {
    if (newStatus === 2) 
        newStatus = 'Denied';
    else 
        newStatus = 'Accepted';
    
    setVerifications(prevVerifications => {
        const updatedVerifications = prevVerifications.map(verification => {
          if (verification.id === verificationId) {
            return {
              ...verification,
              status: newStatus
            };
          }
          return verification;
        });
        return updatedVerifications;
      });
  }

  const sendEmail = (message, sellerEmail) =>{
    const email = {message : message, emailTo : sellerEmail}
    console.log(sellerEmail);
    emailjs.send(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_SERVICE_TEMPLATE, email, process.env.REACT_APP_SERVICE_PUBLIC_KEY);
  }

  return (
    <div className="verification-container">
      <div className="verification-content">
        <h2 className="verification-title">Korisnici</h2>
        <table className="verification-table">
          <thead>
            <tr>
              <th>UserId</th>
              <th>Korisnicko ime</th>
              <th>Email</th>
              <th>Password</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Datum rodjenja</th>
              <th>Adresa</th>
              <th>Slika</th>
              <th>Status</th>
              <th>Accept</th>
              <th>Deny</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map(verification => {
              const seller = sellers.find(s => s.id === verification.userId);
              return (
                <tr key={verification.id}>
                  <td>{verification.userId}</td>
                  <td>{seller?.username}</td>
                  <td>{seller?.email}</td>
                  <td>{seller?.password}</td>
                  <td>{seller?.name}</td>
                  <td>{seller?.surname}</td>
                  <td>{seller?.date}</td>
                  <td>{seller?.address}</td>
                  <td>{seller?.picture}</td>
                  <td>{verification.status}</td>
                  {verification.status !== 'In process' ? (
                    <>
                      <td>-</td>
                      <td>-</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <button className="verification-button" onClick={() => handleAccept(verification.id, seller.email)}>
                          Accept
                        </button>
                      </td>
                      <td>
                        <button className="verification-button" onClick={() => handleDeny(verification.id, seller.email)}>
                          Deny
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Verification;
