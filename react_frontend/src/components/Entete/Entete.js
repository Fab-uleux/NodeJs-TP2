import { NavLink } from "react-router-dom"
import './Entete.css';
import { useContext } from "react";
import { AppContext } from "../App/App";

function Entete(props) {
  
  const contexte = useContext(AppContext)

  return (
    <header>
      <nav>
        <div className="letterbuster">
          <a className="logo"></a>
          <NavLink to="accueil"><h1>Letterbuster</h1></NavLink>
        </div>
        <NavLink to="liste-films">Liste de films</NavLink>
        {contexte ? (
            <nav>
                <NavLink to="/admin" className={"underline"}>
                    Page privée
                </NavLink>
            </nav>
        ) : (
            ""
        )}
        <form onSubmit={props.handleLogin} data-connexion={contexte}>
            {!contexte ? <input type="text" name="courriel" placeholder="Usager"></input> : ""}
            {!contexte ? <input type="password" name="mdp" placeholder="Mot de passe"></input> : ""}
            <button>{contexte ? "Logout" : "Login"}</button>
        </form>
      </nav>
    </header>
  );
}

export default Entete;
