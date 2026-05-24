import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom"; // Pour une redirection propre
import { AuthContext } from "./authContext";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
//utilisation du use contexte
  const { login } = useContext(AuthContext);

  const PageSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      
      const response = await fetch('http://localhost:3000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // application des roles dans les donnés
        login(data.user);
        // token dans le localStorage
        localStorage.setItem('token', data.token);
        
        //Redirection
        navigate("/home"); // Redirige vers la home 
      } else {
        setError(data.message || "Identifiants incorrects");//data.message prend erreur du serveur
      }
    } catch (err) {
      setError("Erreur : Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__brand">
        <h1 className="login-page__brand-title">ADHK</h1>
      </div>

      <div className="login-page__card box">
        <div className="login-page__header">
          <p className="login-page__eyebrow">Gestion du Concessionnaire</p>
          <h2 className="title is-3 login-page__title">Connexion</h2>
        </div>

        <form onSubmit={PageSubmit} className="login-page__form">
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input 
                className="input"
                type="email" 
                placeholder="votre@email.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Mot de passe</label>
            <div className="control">
              <input 
                className="input" 
                type="password" 
                placeholder="*******"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {error && <p className="help is-danger has-text-centered login-page__error">{error}</p>} 

          <div className="control mt-5">
            <button type="submit" className="button is-success is-fullwidth is-medium login-page__submit">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
);
}