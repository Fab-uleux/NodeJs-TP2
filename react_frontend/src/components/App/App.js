//npm install react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Entete from '../Entete/Entete';
import Acceuil from '../Accueil/Accueil';
import ListeFilms from '../ListeFilms/ListeFilms';
import Film from '../Film/Film';
import Filtre from '../Filtre/Filtre';
import Admin from '../Admin/Admin';
import Footer from '../Footer/Footer';
import Erreur404 from '../Erreur404/Erreur404'
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import FormFilm from  '../FormFilm/FormFilm.js'

import './App.css'; 

export const AppContext = React.createContext();

function App() {
  //Variable contenant l'état de connexion
  const [estConnecte, setConnexion] = useState(false);

  //Vérification de la validité
  useEffect(() => {
      if (localStorage.getItem("api-film")) {
          //On vérifie à chaque changement dans la page si notre jeton est valide
          setConnexion(jetonValide());
      }
  }, []);

  async function login(e) {
      //Si on est connecté et qu'on appuie sur le bouton
      console.log(estConnecte);

      e.preventDefault();
      const form = e.target;
      console.log("here");
      if (form.dataset.connexion == "false") {
          const body = {
              courriel: form.courriel.value,
              mdp: form.mdp.value,
          };

          // console.log(body);
          const data = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
          };
          const reponse = await fetch("http://localhost:3301/utilisateurs/connexion", data);
          const token = await reponse.json();
          console.log(token);

          if (reponse.status === 200) {
              console.log(token);
              localStorage.setItem("api-film", token);
              setConnexion(true);
          }
          form.reset();
      } else {
          setConnexion(false);
          localStorage.removeItem("api-film");
          return;
      }
  }

  function jetonValide() {
    try {
        const token = localStorage.getItem("api-film");
        const decode = jwtDecode(token);
        //On vérifie si le jeton est expiré
        if (Date.now() < decode.exp * 1000) {
            return true;
        } else {
            //Si le jeton est invalide, on enlève le jeton du storage
            localStorage.removeItem("api-film");
            return false;
        }
    } catch (erreur) {
        console.log(erreur);
        return false;
    }
}


  // function logout() {
  //   setLogging(logging => ({ ...estConnecte, estLog: false, usager: ""}) )
  // handleLogout={logout}
  // }

  return (
    <AppContext.Provider value={estConnecte}>
        <Entete handleLogin={login} estConnecte={estConnecte} />
        <AnimatePresence mode="wait">

          <Routes>
            <Route path="/" element={<Acceuil />}/>
            <Route path="/accueil" element={<Acceuil />}/>
            <Route path="/liste-films" element={<ListeFilms />}/>
            <Route path="/films/:id" element={<Film />}/>
            <Route path="/filtre" element={<Filtre />}/>
            <Route element={<PrivateRoute />}>
              <Route path="/admin"  />
              <Route path="/admin/ajout-film" element={<FormFilm />}></Route>
            </Route>
            <Route path="/404" element={<Erreur404 />}/>
          </Routes>

        </AnimatePresence>
        <Footer />
    </AppContext.Provider>
  );
}

export default App;


// element={logging.estLog ? <Admin /> : <Navigate to="/" />}
// location={location} key={location.key}