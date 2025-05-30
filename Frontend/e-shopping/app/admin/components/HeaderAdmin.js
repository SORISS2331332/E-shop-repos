"use client";
import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function HeaderAdmin({ searchTerm, setSearchTerm, isVisibleSearch }) {
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

    return (
      <nav className="navbar bg-white shadow-sm px-4">
        <form className="d-flex w-50">
        {
          
          isVisibleSearch && (
            
            <input
                className="form-control rounded-pill me-2 w-50"
                type="search"
                placeholder="🔍 Rechercher"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        
          )
          
        }
        </form>
        <div className="d-flex align-items-center gap-2">
            <FaUser size={25} onClick={() => router.push("/admin/userAdmin")} />
          <div>
            <div className="fw-bold">{formData.prenom} {formData.nom}</div>
            <small className="text-muted">Admin</small>
          </div>
        </div>
      </nav>
    );
  }
  