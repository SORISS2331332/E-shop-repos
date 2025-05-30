import { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ImageUpload({ onUpload, imageId }) {
    const [preview, setPreview] = useState(null);

    // Fonction de gestion de l'upload d'image
    const handleChange = async (e) => {
        const file = e.target.files[0];  // Récupérer le premier fichier de la sélection
        if (!file) return;  // Si aucun fichier, ne rien faire

        // Vérifier la taille du fichier (limite de 1 Mo)
        if (file.size > 1024 * 1024) {
            alert("Fichier trop volumineux (max 1 Mo)");
            return;
        }

        const reader = new FileReader();
        
        // Lorsque la lecture du fichier est terminée, on crée le prévisualisation
        reader.onloadend = async () => {
            const base64 = reader.result;

            try {
                // Envoyer l'image au backend pour l'upload
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64 }),
                });

                const data = await res.json();  // Recevoir la réponse de l'API

                if (res.ok) {
                    setPreview(data.path);  // Définir l'aperçu de l'image
                    onUpload(imageId, data.path);  // Passer le chemin de l'image au parent
                } else {
                    alert(data.error || 'Erreur lors de l\'upload');
                }
            } catch (err) {
                console.error('Erreur lors de l\'upload:', err);
                alert('Erreur lors de l\'envoi de l\'image');
            }
        };

        // Lire l'image en base64
        reader.readAsDataURL(file);
    };

    return (
        <div className="text-center">
            <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleChange} hidden />
                <div className="bg-light rounded-circle p-4 d-inline-block">
                    <Camera />
                </div>
            </label>
            {/* Afficher l'aperçu de l'image si disponible */}
            {preview && <img src={preview} alt="aperçu" style={{ width: 60, marginTop: 10 }} />}
        </div>
    );
}
