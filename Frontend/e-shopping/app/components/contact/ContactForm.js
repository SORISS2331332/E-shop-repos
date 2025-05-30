export default function ContactForm() {
    return (
        <form className="p-4 shadow-sm rounded bg-light contact-form-box">
            <div className="row mb-3">
            <div className="col-md-4">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" placeholder="Votre Nom *" />
            </div>
            <div className="col-md-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Example@example.ca *" />
            </div>
            <div className="col-md-4">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-control" placeholder="ex: +1 (123)-456-7890 *" />
            </div>
            </div>
            <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows="6" placeholder="Votre Message"></textarea>
            </div>
            <div className="text-end">
            <button className="btn btn-dark px-4">Envoyer</button>
            </div>
        </form>
    );
}
