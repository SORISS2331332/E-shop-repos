import { useState, useEffect } from "react";
import AdresseCard from "./AdresseCard";
import AddAdresse from "./AddAdresse";
import { FaPlus } from "react-icons/fa";
import StepIndicator from "./StepIndicator";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";
import { useAuth } from "@/app/context/AuthContext";

const AddressSelection = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [adresse, setAdresse] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(false);

    // Récupération de l'adresse
    useEffect(() => {
        if(user){
            setAdresse(user.adresse);
        }
    }, []);

    const handleSave = (newData) => {
        setAdresse(newData);
        setShowForm(false);
        setEditing(false);
    };

    return (
        <div className={styles.container}>
            <StepIndicator currentStep={1} />
            <h2 className="mb-4">Mon adresse</h2>

            {adresse && !editing && (
                <AdresseCard
                    {...adresse}
                    onEdit={() => setEditing(true)}
                />
            )}

            {!adresse && !showForm && (
                <div className="mt-3" onClick={() => setShowForm(true)} style={{ cursor: "pointer" }}>
                    <FaPlus /> <span className="btn btn-outline-dark ms-2">Nouvelle adresse</span>
                </div>
            )}

            {(showForm || editing) && (
                <AddAdresse
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditing(false);
                    }}
                    editingAdresse={editing ? adresse : null}
                />
            )}

            <div className="mt-4 d-flex justify-content-center">
                <button onClick={() => router.back()} className="me-4 btn btn-outline-dark">Retour</button>
                {
                    adresse &&
                        (<button onClick={() => router.push("/checkout/livraison")} className="btn btn-dark">Suivant</button>)
                }
                
            </div>
        </div>
    );
};

export default AddressSelection;
