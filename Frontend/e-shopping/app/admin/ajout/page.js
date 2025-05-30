'use client';
import { useEffect, useState } from 'react';
import { addArticle } from '@/app/hooks/useArticle';
import styles from '../modifier/[id]/page.module.css';
import { useAuth } from '@/app/context/AuthContext';
import Loading from '@/app/components/Loading';

export default function AddArticlePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: 0,
        categorieId: 0,
        marque: '',
        quantite: 0
        
    });

    const [categories, setCategories] = useState([]);


    const [images, setImages] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const fetchCategories = async () => {
        try {
            const response = await fetch('https://eshop-api-web.up.railway.app/api/Categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Erreur lors de la recherche des categories:", error);
        }
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
                const response = await fetch('/api/uploadcloud', {
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

        try {
            if(user){
                await addArticle(formData, images, user);
                alert('Article ajouté avec succès');
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'article:", error);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, [user]);

    return (
        <>
        {

            categories ? (
                <div className={styles.addArticlePage + " container"}>
                    <h2 className="mb-4 fw-bold text-center">Ajouter un nouvel article</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className="mb-3 text-center">
                            <label className="form-label fw-semibold">Ajouter des photos</label>
                            <div className={styles.imageGrid + " row g-3"}>
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="d-flex col-6 align-items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, i)}
                                            required
                                        />
                                        {images[i]?.url && (
                                            <img
                                                src={images[i].url}
                                                alt={`preview-${i}`}
                                                className={styles.previewImage}
                                            />
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
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Catégorie</label>
                                <select
                                    required
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
                                required
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
                                required
                            />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary px-5">Enregistrer</button>
                        </div>
                    </form>
                </div>
            ):
            (
                <Loading />
            )
        }
        </>
    );
}
