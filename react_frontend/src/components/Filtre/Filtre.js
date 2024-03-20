import { useState } from 'react';
import { motion } from 'framer-motion'
import './Filtre.css';

function Filtre(props) {

    function afficheFiltreActif(e){
        let filtreBtn = e.target.parentNode.children

        for (let i = 0; i < filtreBtn.length; i++) {
            filtreBtn[i].style = "color: none;"
        }

        e.target.style = "color: green"
    }

    const transition = { duration: 0.5, ease: 'easeInOut' };
  
    const variantFiltre = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition },
        exit: { opacity: 0, x: +100, transition }
    }
  
  return (
    <motion.div
        key='filtre'
        initial='hidden'
        animate='visible'
        exit='exit'
        variants={variantFiltre}
        className='filtre'
    >
        <ul>
            <li onClick={(e) => {props.handleFiltre('Réalisateur alphabétique (A-Z)'); afficheFiltreActif(e)}}>
                Réalisateur alphabétique (A-Z) 
            </li> 
            <li onClick={(e) => {props.handleFiltre('Réalisateur alphabétique (Z-A)'); afficheFiltreActif(e)}}>
                Réalisateur alphabétique (Z-A) 
            </li> 
            <li onClick={(e) => {props.handleFiltre('Titre alphabétique (A-Z)'); afficheFiltreActif(e)}}>
                Titre alphabétique (A-Z)
            </li> 
            <li onClick={(e) => {props.handleFiltre('Titre alphabétique (Z-A)'); afficheFiltreActif(e)}}>
                Titre alphabétique (Z-A)
            </li> 
            <li onClick={(e) => {props.handleFiltre('Par année (du plus récent)'); afficheFiltreActif(e)}}>
                Par année (du plus récent)
            </li> 
            <li onClick={(e) => {props.handleFiltre('Par année (du plus ancien)'); afficheFiltreActif(e)}}>
                Par année (du plus ancien)
            </li> 
        </ul>
    </motion.div> 
  );
}


export default Filtre;
