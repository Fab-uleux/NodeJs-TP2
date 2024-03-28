import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import TuileFilm from "../TuileFilm/TuileFilm"
import Filtre from "../Filtre/Filtre"

import './ListeFilms.css';


function ListeFilms() {
  const urlListeFilms = 'https://nodejs-tp2.onrender.com/films';
  
  const [urlFiltre, setUrlFiltre] = useState(urlListeFilms);
  const [listeFilms, setListeFilms] = useState([]);

  const [estCharge, setEstCharge] = useState(false)

  useEffect(() => {
    fetch(urlFiltre)
      .then((reponse) => reponse.json())
      .then((data) => {
        // console.log(data);
        setListeFilms(data);

        setEstCharge(true);
      });
  }, [urlFiltre]);

  const tuileFilm = listeFilms.map((film, index) => {
    return (
      <Link key={index} to={`/films/${film.id}`}>
        <TuileFilm data={film} />
      </Link>
    );
  })


  function fUrl(filtre) {
    let url;
    switch (filtre) {
      case 'Réalisateur alphabétique (A-Z)':
        url = `${urlListeFilms}?orderBy=realisation&orderDirection=asc`;
        break;
      case 'Réalisateur alphabétique (Z-A)':
        url = `${urlListeFilms}?orderBy=realisation&orderDirection=desc`;
        break;
      case 'Titre alphabétique (A-Z)':
        url = `${urlListeFilms}?orderBy=titre&orderDirection=asc`;
        break;
      case 'Titre alphabétique (Z-A)':
        url = `${urlListeFilms}?orderBy=titre&orderDirection=desc`;
        break;
      case 'Par année (du plus récent)':
        url = `${urlListeFilms}?orderBy=annee&orderDirection=desc`;
        break;
      case 'Par année (du plus ancien)':
        url = `${urlListeFilms}?orderBy=annee&orderDirection=asc`;
        break;
      default:
        url = urlListeFilms;
        break;
    }
    setUrlFiltre(url);
  }

  const transition = { duration: 0.5, ease: 'easeInOut' };
  
  const variant = {
    hiddeen: { opacity: 0.5, y: -100 },
    visible: { opacity: 1, y: 0, transition },
    exit: { opacity: 0.5, y: 100, transition }
  }

  return (
    <main>
      <div className="filtre">
        <Filtre handleFiltre={fUrl} />
      </div>
      {estCharge ? (
      <motion.div 
        key='listeFilm'
        initial='hidden'
        animate='visible'
        exit='exit'
        variants={variant}
        className="tuile"
      >
        {tuileFilm}
      </motion.div>
      ) : ( '' )}
    </main>
  );
}

export default ListeFilms;
