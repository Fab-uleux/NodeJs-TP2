import './Film.css';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import  Commentaire  from '../Commentaire/Commentaire'
import Note from '../Note/Note';

function Film() {

  let { id } = useParams();

const urlFilm = `https://four1f-node-api.onrender.com/films/${id}`
// const urlFilm = `https://nodejstp1.onrender.com/films/${id}`
const [film, setFilm] = useState({})

useEffect(() => {

  fetch(urlFilm)
    .then((reponse) => reponse.json())
    .then((data) => {
      //console.log(data.commentaires)
      setFilm(data);
    })
}, []);
    
  return (
    <article className="film">
      <div className='poster'>
        <img src={`/img/${film?.titreVignette}`} alt={film?.titre} />
      </div>
      <div className='header'>
        <h1>{film?.titre}</h1>
        <h3>{film?.realisation}</h3>
        <h3>{film?.annee}</h3>
        <h3>{film?.description}</h3>
      </div>
      <section className='user'>
        <Note />
        <Commentaire data={{param: id, commentaires: film.commentaires}} />
      </section>
    </article>
    
  );
}

export default Film;
