import './Commentaire.css';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App/App';

function Commentaire(props) {
    //console.log(props.data);
    const context = useContext(AppContext);

    let id = props.data.param;

    const urlFilm = `https://four1f-node-api.onrender.com/films/${id}`;
    // const urlFilm = `https://nodejstp1.onrender.com/films/${id}`;
    
    const [listeCommentaire, setListeCommentaire] = useState([]);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        setListeCommentaire(props.data.commentaires);
    },[props.data.commentaires]);

    let blockShowCommentaire;
    // console.log(listeCommentaire)
    if (listeCommentaire && listeCommentaire.length > 0) {
        blockShowCommentaire =
            listeCommentaire.map((indexCommentaire, index) => (
                <div key={index}>
                    <h5>Comment: {indexCommentaire.commentaire}<small> - User: {indexCommentaire.usager}</small></h5>
                </div>
            ));
    } else {
        blockShowCommentaire = <h3>Aucun commentaire</h3>;
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }
    
    let btnAjoutcommentaire;
    if (context.estLog){
        btnAjoutcommentaire =
        <button onClick={toggleModal}>Rajouter votre Commentaire</button>
    }

    
    let blockAjoutCommentaire = (
        <form onSubmit={soumettreCommentaire}>
            <textarea placeholder='Commentaire'></textarea>
            <button type="submit">Soumettre</button>
        </form>
    );
    

    async function soumettreCommentaire(e){
        e.preventDefault()
        
        let aCommentaires;
        let commentaireValue = document.querySelector("textarea").value;


        if (!listeCommentaire) {
            aCommentaires = [{ commentaire: commentaireValue, usager: context.usager }];
        } else {
            aCommentaires = listeCommentaire;
            aCommentaires.push({ commentaire: commentaireValue, usager: context.usager });
        }
        
        const oOption = {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({commentaires: aCommentaires})
        }

        let putCommentaire = await fetch(urlFilm, oOption),
            getCommentaire = await fetch(urlFilm);

        Promise.all([putCommentaire, getCommentaire])
            .then(response => response[1].json())
            .then((data) => {
                    setListeCommentaire(data.commentaires)
        });
        
        toggleModal();
    };

    return (
        <section className='commentaire'>
            <div className='show'>
                {blockShowCommentaire}
            </div>
            <div className='ajout'>
                {btnAjoutcommentaire}
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        {blockAjoutCommentaire}
                    </div>
                </div>
            )}
        </section>
    );
}


export default Commentaire;
