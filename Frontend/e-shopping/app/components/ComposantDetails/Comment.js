export default function Comment(props) {
    return (
        <div className="mb-4 p-3 bg-light rounded">
          <div className="d-flex justify-content-between">
            <strong>{props.nom}</strong>
            <small className="text-muted">
              {props.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </small>
          </div>
          <p className="text-warning">
            {'★'.repeat(props.rating)}{'☆'.repeat(5 - props.rating)}
          </p>
          <p>{props.text}</p>
        </div>
    );
}