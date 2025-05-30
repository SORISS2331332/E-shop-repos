import { FaEdit } from "react-icons/fa";

const AdresseCard = ({ codeCivique, rue, ville, pays, codePostal, onEdit }) => (
    <div className="card mb-3 shadow-sm">
        <div className="card-body">
            <div className="d-flex  flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="mb-2 mb-md-0">
                    <span className="badge bg-dark text-white mb-2">Adresse actuelle</span>
                    <p className="mb-0">{codeCivique} {rue}, {ville}, {codePostal}, {pays}</p>
                </div>
                <div className="text-md-end w-100 w-md-auto">
                    <button onClick={onEdit} className="btn btn-outline-primary btn-sm mt-2 mt-md-0">
                        <FaEdit /> Modifier
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default AdresseCard;