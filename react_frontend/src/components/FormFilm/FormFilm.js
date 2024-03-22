import { useState } from 'react';
import '../FormFilm/FormFilm.css';

import { useNavigate } from 'react-router-dom';

function FormFilm(){
    const genres = [
        "Action",
        "Aventure",
        "Comédie",
        "Frame",
        "Fantaisie",
        "Horreur",
        "Policier",
        "Science-Fiction",
        "Thriller",
        "Western",
    ]

    const [formData, setFormData] = useState({
        titre:"",
        description:"",
        realisation:"",
        annee:"",
        genre:[],
        titreVignette:"vide.jpg",
    })

    const [formValidity, setFromValidity] = useState("invalid")
    const navigate = useNavigate();

    function onFormDataChange(e){
        const {name, value} = e.target;

        const donneeModifiee = {...formData, [name]: value};
        setFormData(donneeModifiee)

        const estValide = e.target.form.chechValidity() ? "valid" : "invalid";
        setFromValidity(estValide)
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(formValidity === "invalid"){
            e.target.reportValidity();
            return;
        }
        const data = {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:""
            }, 
            body:JSON.stringify(formData),
        }

        const request = await fetch("http://localhost:3301/api/films", data)
        const response = await request.json();

        if(request.status === 200){
            console.log("WOW such request")
            setFormData({
                titre:"",
                description:"",
                realisation:"",
                annee:"",
                genre:[],
                titreVignette:"vide.jpg",
            });
            setFromValidity("invalid")
            navigate("/")
        } else {
            console.log("Erreur")
        }
    }

    return(
        <div className="wrapperform">
            <h1>Ajouter un Film</h1>
            <form className={formValidity} onSubmit={onFormSubmit}>
                <div className="input-group">
                    <label htmlFor="titre">Titre</label>
                    <input 
                    type="text"
                    id="titre" 
                    name="titre" 
                    value= {formData.titre} 
                    onChange={onFormDataChange}
                    required
                    minLength={1}
                    maxLength={150}
                    ></input>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                    type="text"
                    id="description" 
                    name="description" 
                    value= {formData.description} 
                    onChange={onFormDataChange}
                    minLength={1}
                    maxLength={500}
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="realisation">Realisation</label>
                    <input 
                    type="text"
                    id="realisation" 
                    name="realisation" 
                    value= {formData.realisation} 
                    onChange={onFormDataChange}
                    ></input>
                </div>
                <div className="input-group">
                    <label htmlFor="realisation">Annee</label>
                    <input 
                    type="date"
                    id="annee" 
                    name="annee" 
                    value= {formData.annee} 
                    onChange={onFormDataChange}
                    ></input>
                </div>
                <div className='input-group'>
                    <p>Genre</p>
                    {
                        genres.map((element,index)=>{
                            return (
                                <div></div>
                            )
                        })
                    }
                </div>
                <div className="input-group">
                    <label htmlFor="realisation">titreVignette</label>
                    <input 
                    type="text"
                    id="titreVignette" 
                    name="titreVignette" 
                    value= {formData.titreVignette} 
                    onChange={onFormDataChange}
                    ></input>
                </div>
                <input type="submit" value="Envoyer" disabled={formValidity == "invalid" ? "disabled" : ""}></input>
            </form>
            { <div className='erreur'></div>}
        </div>
    )

}

export default FormFilm;