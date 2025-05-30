import { MdCall, MdEmail } from 'react-icons/md';

export default function ContactInfo() {
    return (
        <div className="p-4 shadow-sm rounded bg-light contact-info-box">
        <div className="mb-4">
            <h6 className="d-flex align-items-center mb-2">
            <MdCall className="text-danger fs-4 me-2" /> Appellez-nous
            </h6>
            <p className="text-muted mb-1">Nous sommes disponibles 24/7</p>
            <p className="text-muted">Phone: +1 (123) 456-7890</p>
        </div>
        <hr />
        <div className="mt-4">
            <h6 className="d-flex align-items-center mb-2">
            <MdEmail className="text-danger fs-4 me-2" /> Écrivez-nous
            </h6>
            <p className="text-muted mb-1">
                Remplissez le formulaire ci-dessous et nous vous contacterons 
                dans les plus brefs delais (24 heures max)
            </p>
            <p className="text-muted">customer@e-shop.com</p>
            <p className="text-muted">support@e-shop.com</p>
        </div>
        </div>
    );
}
