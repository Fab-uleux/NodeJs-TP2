import './Note.css';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

function Note() {
    let { id } = useParams();

    // const urlFilm = `https://four1f-node-api.onrender.com/films/${id}`
    const urlFilm = `https://nodejs-tp2.onrender.com/films/${id}`

    const [film, setFilm] = useState({})
    const [moy, setMoy] = useState("")
    const [total, setTotal] = useState("")
    const [note, setNote] = useState("")

    useEffect(() => {
        fetch(urlFilm)
            .then((reponse) => reponse.json())
            .then((data) => {
                setFilm(data);
                let notes = Array.isArray(data.notes) ? data.notes : []
                calculNote(notes)
                
                
            })
        }, []);

    let blockShowNote;
    if ( total > 0) {
        blockShowNote = (
            <div className='moy'>
                <h1> Moyenne: {moy}</h1>
                <small>Vote total: {total}</small>
            </div>
        );
    } else {
        blockShowNote = <h3>Ce film n'a pas de vote</h3>;
    }
    
    function calculNote(vote){
        let voteE = Number(e.target.getAttribute('data-value'))
    if(!vote){
        vote = [voteE]
    } else {
        console.log("calculeNote(data)",vote)
        let dataNote = vote
        let somme = 0;
        let compte = 0;

        for (let i = 0; i < dataNote.length; i++) {
            if (dataNote[i] !== null) {
                somme += dataNote[i];
                compte++;
            }
        }
        const moyVote = (somme / compte + 1).toFixed(1);
        const totalVote = compte + 1 

        setTotal(totalVote)
        setMoy(moyVote)
        }
    }

    async function soumettreNote(e){
    
    let note = Number(e.target.getAttribute('data-value'));
    let aNotes;
        if(!film.notes){
            film.notes = []
        } else {
            aNotes = film.notes
            aNotes.push(Number(note));
            console.log(aNotes)
        }
    

    const oOption = {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({notes: aNotes})
    }

    let putNote = await fetch(urlFilm, oOption),
        getFilm = await fetch(urlFilm);

    Promise.all([putNote, getFilm])
        .then(response => response[1].json())
        .then((data) => {
        setFilm(data)
        calculNote(data.notes)
    });
    
    }
    return(
    <section className='note'>
        <div className='soumettre'>
            <button data-value="1" className={note >= 1 ? "star" : ""} onClick={soumettreNote}></button>
            <button data-value="2" className={note >= 2 ? "star" : ""} onClick={soumettreNote}></button>
            <button data-value="3" className={note >= 3 ? "star" : ""} onClick={soumettreNote}></button>
            <button data-value="4" className={note >= 4 ? "star" : ""} onClick={soumettreNote}></button>
            <button data-value="5" className={note >= 5 ? "star" : ""} onClick={soumettreNote}></button>
        </div>
        {blockShowNote}
    </section>

    );
}

export default Note;

