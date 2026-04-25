import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Pour une redirection propre

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

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
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="box" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px', border: '2px solid #3273dc', padding: '2rem' }}>
      
      {/* Le titre  centré */}
      <h2 className="title is-3 has-text-centered">Connexion</h2>
      
      <form onSubmit={PageSubmit}>
        {/* On utilise les classes field et label de Bulma pour l'espacement */}
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
        {/* meme fonctionalité que le data.message et help permet de confuer la typographie du message erreur. */}
        {error && <p className="help is-danger has-text-centered" style={{ fontSize: '1rem' }}>{error}</p>} 

        <div className="control mt-5">
          <button type="submit" className="button is-success is-fullwidth is-medium ">
            Se connecter
          </button>
        </div>
      </form>
    </div>
  </div>
);
}