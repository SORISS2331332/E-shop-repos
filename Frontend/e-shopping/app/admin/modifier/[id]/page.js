'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { updateArticle } from '@/app/hooks/useArticle';
import { useAuth } from '@/app/context/AuthContext';
import styles from './page.module.css';
import AuthGuard from '@/app/context/AuthGard';

export default function EditArticlePage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nom: '',
        prix: '',
        categorieId: 0,
        quantite: '',
        marque: '',
        description: '',
        id: null
    });

    const [images, setImages] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://eshop-api-web.up.railway.app/api/Categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Erreur lors de la recherche des categories:", error);
        }
    }
  // Charger l'article et ses images
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
        const articleRes = await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${id}`);
        const article = await articleRes.json();

        const imagesRes = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${id}`);
        const imgs = await imagesRes.json();

        setFormData({ ...article });
        setImages(imgs.map(img => ({ id: img.id, url: img.lien })));
        };

        fetchData();
        fetchCategories();
    }, [id, user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
        alert("Fichier trop volumineux (max 1 Mo)");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64 = reader.result;

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedImages = [...images];
                updatedImages[index] = { id: null, url: data.path };
                setImages(updatedImages);
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { error: "Erreur serveur sans réponse JSON" };
                }
                alert(errorData.error || "Erreur lors de l'upload de l'image");
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            alert("Erreur réseau lors de l'upload.");
        }
    };

    reader.readAsDataURL(file);
};





    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(user){
                await updateArticle(formData.id, formData, images, user);
                alert('Article modifié avec succès');
            }
        }catch(error){
            console.error("Erreur lors de la modification de l'article:", error);
        }
        
    };

    return (
        <>
            <div className={styles.addArticlePage + " container"}>
            <h2 className="mb-4 fw-bold">Modifier l’article</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="mb-3 text-center">
                <label className="form-label fw-semibold">Ajouter des photos</label>
                <div className={styles.imageGrid + " row"}>
                    {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="d-flex col-4 col-md-4 col-sm-6 align-items-center me-5">
                        <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, i)}
                        />
                        {images[i]?.url && (
                        <img src={images[i].url} alt={`preview-${i}`} className={styles.previewImage} />
                        )}
                    </div>
                    ))}
                </div>
                </div>

                <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label">Nom</label>
                    <input
                    type="text"
                    className="form-control"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Prix</label>
                    <input
                    type="number"
                    className="form-control"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

                <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label">Catégorie</label>
                    <select
                        className="form-select"
                        name="categorieId"
                        value={formData.categorieId}
                        onChange={(e) =>
                            setFormData({ ...formData, categorieId: parseInt(e.target.value) })
                        }
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Quantité</label>
                    <input
                    type="number"
                    className="form-control"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

                <div className="mb-3">
                <label className="form-label">Marque</label>
                <input
                    type="text"
                    className="form-control"
                    name="marque"
                    value={formData.marque}
                    onChange={handleInputChange}
                />
                </div>

                <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                />
                </div>

                <div className="text-center">
                <button type="submit" className="btn btn-primary px-5">Enregistrer</button>
                </div>
            </form>
            </div>
        </>
    );
}
