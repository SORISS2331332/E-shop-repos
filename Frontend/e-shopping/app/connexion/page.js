"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { signIn } from 'next-auth/react';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
export default function Connexion() {

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [erreur, setErreur] = useState("");

  const getUser = async (id, token) => {
  try {
    const response = await fetch('https://eshop-api-web.up.railway.app/api/Users/'+ id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      setErreur(data.message);
    }
  } catch (error) {
    setErreur("Une erreur est survenue. Veuillez essayer plus tard.");
  }
}
  const handleSunmit = async (e) => {
    e.preventDefault();
    const loginDto = {
        Email: email,
        Password: password
    };
    try {
      const response = await fetch('https://eshop-api-web.up.railway.app/api/Accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginDto)
      });
      
      if (response.ok) {
        const data = await response.json();
        const user = await getUser(data.userId, data.token);
        login(user, data.token);
        if(user.role === "Admin"){
          router.push('/admin');
        }
        else{
          router.push('/');
        }
      } else {
        setErreur("Mot de passe ou email incorrect");
      }
      

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  }
  return (
    <>
    <div className="container-fluid min-vh-100 d-flex align-items-center">
        <div className="row flex-grow-1">
          <div className="col-md-6 d-flex align-items-center justify-content-center ">
            <Image
              src="/images/log.png"
              alt="Shopping Image"
              width={400}
              height={400}
              className="img-fluid"
            />
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5">

            <h3 className="fw-bold mb-3">Se connectez via</h3>
            <div className="d-flex  gap-2 mb-4">
                <button
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                    <FaGoogle size={20} />
                </button>

                <button
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                    onClick={() => signIn('facebook')}
                >
                    <FaFacebook size={20} />
                </button>

                <button
                    className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
                    onClick={() => signIn('github', { callbackUrl: '/' })}
                >
                    <FaGithub size={20} />
                </button>
            </div>
            <h4 className=" mb-3">Ou entrez vos identifiants</h4>
            {
              erreur && (
                <div className="alert alert-danger" role="alert">
                  {erreur}
                </div>
              )
            }
            <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleSunmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control border-0 border-bottom rounded-0"
                  placeholder="Email "
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErreur("");
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control border-0 border-bottom rounded-0"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErreur("");
                  }}
                  required
                  
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-dark px-4">
                  Se connecter
                </button>
                <Link href="/forget-password" className="text-danger px-3 text-decoration-none">
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="mt-5 d-flex justify-content-between align-items-center">
                <span className="text-muted">Vous n'avez pas de compte?</span>
                <Link href="/inscription" className="btn btn-outline-dark px-3 text-decoration-none">
                  S'inscrire
                </Link>
              </div>
            </form>
          </div>
        </div>
    </div>
    </>
  );
}
