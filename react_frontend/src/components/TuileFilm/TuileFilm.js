import './TuileFilm.css';

function TuileFilm(props) {
  
  return (
    <article className="card">
      <img src={`img/${props.data.titreVignette}`} alt={props.data.titre} />
    </article>
  );
}

export default TuileFilm;
