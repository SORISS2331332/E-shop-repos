"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function EditAdresse() {
  const [adresse, setAdresse] = useState({
    id: "",
    codeCivique: "",
    rue: "",
    ville: "",
    pays: "",
    codePostal: "",
  });

  const { user, updateUser } = useAuth();


  const handleChange = (e) => {
    setAdresse({ ...adresse, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      setAdresse(user.adresse);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user.id) {
        console.error("ID utilisateur manquant");
        return;
      }
      
      const response = await fetch(`https://eshop-api-web.up.railway.app/api/Adresses/${user.adresseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(adresse),
      });

      if (!response.ok || !response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'adresse");
      }
      const userdata = {...user, adresse: adresse}
      updateUser(userdata);
      alert("Adresse mise à jour avec succès.");
    } catch (error) {
      console.error("Erreur :", error);
    }
    
  };

  return (
    <>
    {
      (user && user.adresse) ? (
      <form onSubmit={handleSubmit} >
        <h5 className="mb-4 text-center">Modifier votre adresse</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Code civique</label>
            <input
              type="text"
              name="codeCivique"
              value={adresse.codeCivique}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-8 mb-3">
            <label>Rue</label>
            <input
              type="text"
              name="rue"
              value={adresse.rue}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Ville</label>
            <input
              type="text"
              name="ville"
              value={adresse.ville}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Code postal</label>
            <input
              type="text"
              name="codePostal"
              value={adresse.codePostal}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Pays</label>
            <input
              type="text"
              name="pays"
              value={adresse.pays}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-danger">
            Sauvegarder l'adresse
          </button>
        </div>
      </form>
      ) : (
        <h3>Aucune adresse  trouvée.</h3>
      )
    }
    </>
  );
}
