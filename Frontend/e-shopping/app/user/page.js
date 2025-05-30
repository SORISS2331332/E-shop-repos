"use client";

import { useState, useEffect } from 'react';
import SidebarProfile from '../components/composantUser/SidebarProfile';
import ProfileForm from '../components/composantUser/ProfileForm';
import EditAdresse from '../components/composantUser/EditAdresse';
import MyCommande from '../components/composantUser/MyCommande';
import ListeFavoris from '../components/ComposantFavoris/ListeFavoris';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import AuthGuard from '../context/AuthGard';
export default function AccountPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState("profil"); // par défaut



  useEffect(() => {
    if (user) {
        setFormData(user);
    }
  }, [user]);


  const renderSection = () => {
    switch (activeSection) {
      case "profil":
        return <ProfileForm />;
      case "adresse":
        return <EditAdresse />;
      case "commandes":
        return <MyCommande />;
      case "favoris":
        return <ListeFavoris />;
      default:
        return <ProfileForm />;
    }
  };

  return (
    <AuthGuard allowedRoles={['Client']}>
      <div className="container my-5" style={{ paddingTop: '100px', flexGrow: 1 }}>
        <p className="text-muted"><Link className="text-danger" href="/">Accueil</Link> / Mon Compte</p>
        <div className="row">
          <div className="col-md-3">
          <SidebarProfile onSelect={setActiveSection} activeSection={activeSection} />
          </div>
          <div className="col-md-9">
            <div className="bg-white p-4 border rounded">
              {
                user && (
                  <div className="mb-3 text-end">
                    Bienvenue <span className="fw-bold text-danger">{formData.prenom} {formData.nom} !</span>
                  </div>
                )
              }
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
