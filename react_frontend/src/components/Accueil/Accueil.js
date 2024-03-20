import { motion } from 'framer-motion'
import React, { useContext } from 'react';
import './Accueil.css';
import accueil from './Accueil.json'
import { AppContext } from '../App/App';

function Accueil() {

  const context = useContext(AppContext);

  const contenueAccueil = accueil.map((paragraphe, index) => {
    return <h1 key={index}>{paragraphe}</h1>
  })

  const transition = { duration: 0.5, ease: 'easeInOut' };
  
  const variant = {
    hiddeen: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, transition },
    exit: { opacity: 1, y: 0, transition }
  }
  return ( 
    <motion.main
      key='accueil'
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={variant}
      className='accueil'
    >
      <div className='wrapper'>
      

        <div className='banner-wrapper'>
          
          <img src="https://a.ltrbxd.com/resized/sm/upload/y1/1r/x7/80/obi-wan-0-1200-0-525-crop.jpg?k=df7f8b9a35" alt="Banner" />
          <div className="overlay">
          <div className='accueil'>{accueil}</div>
          {context.estLog ? <h3>Bienvenue : <span>Simon</span></h3> : null}
            
          </div>
          
        </div>
        
        

      </div>

    </motion.main>
      
  );
}

export default Accueil;


