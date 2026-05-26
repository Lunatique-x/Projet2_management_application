import { useState, useContext } from "react";
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
    
    //  1. Définition de la Regex pour l'adresse courriel
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const erreursTrouvees = [];

    //  2. Validation des données : on pousse dans le tableau au lieu de faire un "return"
    if (!regexEmail.test(email.trim())) {
      erreursTrouvees.push("L'adresse courriel n'est pas valide.");
    }

    if (!password.trim()) {
      erreursTrouvees.push("Le mot de passe ne peut pas être vide.");
    }

    //  3. C'est ici qu'on bloque l'exécution si le tableau contient des erreurs
    if (erreursTrouvees.length > 0) {
      setError(
        <div>
          <p className="has-text-weight-bold mb-2">Erreur de validation :</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '20px', textAlign: 'left' }}>
            {erreursTrouvees.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      );
      return; // On bloque le fetch
    }

    try {
      const response = await fetch('http://localhost:3000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
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
        // Erreur serveur formatée comme les autres
        setError(
          <div>
            <p className="has-text-weight-bold">Erreur :</p>
            <p>{data.message || "Identifiants incorrects."}</p>
          </div>
        );
      }
    } catch (err) {
      setError(
        <div>
          <p className="has-text-weight-bold">Erreur réseau :</p>
          <p>Impossible de contacter le serveur.</p>
        </div>
      );
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

        {/*  Zone d'alerte carrée Bulma */}
        <div aria-live="assertive" className="mt-3">
          {error && (
            <div className="notification is-danger is-light" style={{ borderRadius: '6px', border: '1px solid #ff3860' }}>
              <button type="button" className="delete" onClick={() => setError('')}></button>
              {error}
            </div>
          )} 
        </div>

        {/*  noValidate pour empêcher les bulles du navigateur */}
        <form onSubmit={PageSubmit} className="login-page__form" noValidate>
          <div className="field">
            {/* Lié avec htmlFor pour l'accessibilité */}
            <label htmlFor="login-email" className="label">Email</label>
            <div className="control">
              <input 
                id="login-email" //  Identifiant unique lié au label
                className="input"
                type="email" 
                placeholder="votre@email.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="username" //  Aide pour les gestionnaires de mots de passe
              />
            </div>
          </div>

          <div className="field">
            {/* Lié avec htmlFor pour l'accessibilité */}
            <label htmlFor="login-password" className="label">Mot de passe</label>
            <div className="control">
              <input 
                id="login-password" //  Identifiant unique lié au label
                className="input" 
                type="password" 
                placeholder="*******"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password" //  Aide pour les gestionnaires de mots de passe
              />
            </div>
          </div>

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