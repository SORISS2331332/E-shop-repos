"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
export default function ProfileForm() {

  //Récuperer les informations l'utilisateur connecté
  const [formData, setFormData] = useState({});


  const { updateUser,user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        photo: user.photo
      });
    }
  }, [user]);

  const getuser = async () => {
    const response = await fetch(`https://eshop-api-web.up.railway.app/api/Users/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user?.token}`
      }
    });
    const data = await response.json();
    return data;
  };


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    try {
      // Vérifie que formData contient un identifiant utilisateur
      if (!formData.id) {
        console.error("ID utilisateur manquant");
        return;
      }
      
  
      const response = await fetch(`https://eshop-api-web.up.railway.app/api/Users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(formData),
      });
  
      if(response.ok) {
        const data = await getuser();
        const userdata = {
          ...data,
          adresse: user.adresse,
          token: user.token
        }
        updateUser(userdata);
      }

    } catch (error) {
      console.error("Erreur pendant la mise à jour :", error.message);
    }
  };

  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword === currentPassword) {
      alert("Le nouveau mot de passe doit différer du mot de passe actuel.");
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      if (!formData.id) {
        console.error("ID utilisateur manquant");
        return;
      }
  
      const updatedPass = {
        userId: formData.id,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      };
  
      const response = await fetch(`https://eshop-api-web.up.railway.app/api/Users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(updatedPass),
      });
  
      if (!response.ok) {
        console.error("Erreur serveur :", await response.text());
        return;
      }
      alert("Mot de passe mis à jour avec succès.");
    } catch (error) {
      console.error("Erreur pendant la mise à jour :", error.message);
    }
  }


  return (
    <>
    {
      (user && formData) && (
        <form onSubmit={handleSubmit}>
          <h5 className="mb-4 text-center">Modifier votre profil</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Prénom</label>
              <input type="text" name="prenom" value={formData.prenom || ""}  onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6 mb-3">
              <label>Nom de famille</label>
              <input type="text" name="nom" value={formData.nom || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <h6 className="text-secondary mt-4 mb-3">Changer le mot de passe</h6>
          <div className="mb-3">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-outline-dark me-2" onClick={changePassword}>Modifier le Mot De Passe</button>
            <button type="submit" className="btn btn-outline-dark">Sauvegarder</button>
          </div>
        </form>
      )
    }
    </>
  );
}
