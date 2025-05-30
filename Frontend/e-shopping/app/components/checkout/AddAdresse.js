'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
const AddAdresse = ({ onSave, onCancel, editingAdresse }) => {

    const { user, updateUser } = useAuth(); 

    const [formData, setFormData] = useState({
        codeCivique: '',
        rue: '',
        ville: '',
        pays: '',
        codePostal: '',
    });

    useEffect(() => {
        if (editingAdresse) {
            setFormData(editingAdresse);
        }
    }, [editingAdresse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const isEditing = !!editingAdresse?.id;

            const url = isEditing
                ? `https://eshop-api-web.up.railway.app/api/Adresses/${formData.id}`
                : 'https://eshop-api-web.up.railway.app/api/Adresses';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}` 
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erreur lors de l'envoi");

            const data = await response.json();
            onSave(data);


            //O met à jour l'utilisateur avec idAdresse
            
            if (user) {
                const updatedUser = {
                    ...user,
                    adresseId: data.id,
                    adresse: data,
                };

                await fetch(`https://eshop-api-web.up.railway.app/api/Users/update-adresse`, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}` 
                        },
                        body: JSON.stringify({ idUtilisateur: user.id, idAdresse: data.id }),
                });

                    updateUser(updatedUser);
            }
            

            // Réinitialiser le formulaire
            setFormData({
                codeCivique: '',
                rue: '',
                ville: '',
                pays: '',
                codePostal: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card p-3 mt-3">
            <h5>{editingAdresse ? "Modifier l'adresse" : "Ajouter une adresse"}</h5>
            <div className="row">
                <div className="col-md-2 mb-3">
                    <label htmlFor="codeCivique" className="form-label">Code Civique</label>
                    <input
                        type="text"
                        name="codeCivique"
                        id="codeCivique"
                        value={formData.codeCivique}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="rue" className="form-label">Rue</label>
                    <input
                        type="text"
                        name="rue"
                        id="rue"
                        value={formData.rue}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <label htmlFor="ville" className="form-label">Ville</label>
                    <input
                        type="text"
                        name="ville"
                        id="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <label htmlFor="pays" className="form-label">Pays</label>
                    <input
                        type="text"
                        name="pays"
                        id="pays"
                        value={formData.pays}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <label htmlFor="codePostal" className="form-label">Code Postal</label>
                    <input
                        type="text"
                        name="codePostal"
                        id="codePostal"
                        value={formData.codePostal}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {editingAdresse ? "Mettre à jour" : "Ajouter"}
                </button>
                <button className="btn btn-outline-dark" onClick={onCancel}>Annuler</button>
            </div>
        </div>
    );
};

export default AddAdresse;
