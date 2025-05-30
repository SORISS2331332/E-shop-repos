"use client";

import { useState, useEffect } from 'react';

import { useAuth } from '@/app/context/AuthContext';
import ProfileForm from '../components/ProfileForm';
import EditAdresse from '../components/EditAdresse';
import SidebarProfile from '../components/SidebarProfile';
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
      default:
        return <ProfileForm />;
    }
  };

  return (
    <div className="container my-5">
      <p className="text-muted"><a href="/admin">Accueil</a> / Mon Compte</p>
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
  );
}
