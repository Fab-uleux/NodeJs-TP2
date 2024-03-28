import React, { useEffect, useState } from 'react';
import TuileFilm from "../TuileFilm/TuileFilm";

import './Admin.css';

function Admin() {
  const urlAdminFilms = 'https://nodejs-tp2.onrender.com/films';
  const [adminFilms, setAdminFilms] = useState([]);

  useEffect(() => {
    fetch(urlAdminFilms)
      .then((reponse) => reponse.json())
      .then((data) => {
        setAdminFilms(data);
      });
  }, []);

  async function filmDelete(id) {// TO FIX-----deleteFilm(Film) can't be re-used here? Whatever, This entire page is redundant anyways. Lame admin pages are soo000 2015.
    
      const token = localStorage.getItem('api-film');
  
      const response = await fetch(`https://nodejs-tp2.onrender.com/films/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        setAdminFilms(adminFilms.filter(film => film.id !== id));//Shit is ugly
      }
  }
  
  return (
    <div className="accueil">
      {adminFilms.map((film) => (
        <div key={film.id} className="film-tile">
          <TuileFilm data={film} />
          <button onClick={() => filmDelete(film.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;