import './Note.css';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

function Note() {
    let { id } = useParams();

    // const urlFilm = `https://four1f-node-api.onrender.com/films/${id}`
    const urlFilm = `https://nodejs-tp2.onrender.com/films/${id}`
//notes:[]
    const [film, setFilm] = useState({})
    const [moy, setMoy] = useState("")
    const [total, setTotal] = useState("")
    const [note, setNote] = useState("")

    useEffect(() => {
        fetch(urlFilm)
            .then((reponse) => reponse.json())
            .then((data) => {
                data = data.notes ? data : {...data, notes:[]}
                setFilm(data);
                //calculNote(data)
                //console.log(calculNote(data), "useEffect Data")

            })
        }, []);

    let blockShowNote;
    if ( total > 0) {
        blockShowNote = (
            <div className='moy'>
                <h1> Moyenne: { moy }</h1>
                <small>Vote total: { total }</small>
            </div>
        );
    } else {
        blockShowNote = <h3>Ce film n'a pas de vote</h3>;
    }
    
    function calculNote(data){
    // if(!data){
    //     data = []
    // } else {
        console.log("calculeNote(data)",data.note)

        /*
        let dataNote = data
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
    //     }
    */
    }

    async function soumettreNote(e){


        
        let note = e.target.getAttribute('data-value');
        //console.log(note, "note")
        
        //console.log(film)

        let aNotes = film.notes;

        
        aNotes.push(parseInt(note));

        
        setFilm((prevFilm) => ({...prevFilm, notes: aNotes}));

        //console.log(film)
        
        //console.log(aNotes, "aNotes");

        /*

        // if(aNotes == []){
            console.log("Prout")
            aNotes.push(Number(note));
        // }
        //[...film.notes]
        console.log(film, "film")
        */
        
        const oOption = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({notes: aNotes})
            body: JSON.stringify(film)
        }

        /*
        let putNote = await fetch(urlFilm, oOption);
        let reponsePut = await putNote.json();
        
        let getFilm = await fetch(urlFilm);
        let reponseGet = await getFilm.json();
        
        setFilm(reponseGet);
        calculNote(reponseGet.notes);
        */

        let putNote = await fetch(urlFilm, oOption);
        let getFilm = await fetch(urlFilm);

        Promise.all([putNote, getFilm])
            .then(response => response[1].json())
            .then((data) => {
                console.log(data)
                //setFilm(data)
                //calculNote(data.notes)
            });
    }

    return(
        <section className='note'>
            <p>test</p>
            {film.notes}
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

