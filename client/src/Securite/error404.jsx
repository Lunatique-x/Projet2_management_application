import { Link, useNavigate } from "react-router-dom";

export function Error404() { 
    const navigate = useNavigate();

    return (
        <div className="section is-medium">
            <div className="container has-text-centered" style={{ maxWidth: '600px' }}> {/* On garde juste un max-width pour éviter que la boîte soit trop large sur grand écran */}
                
                {/* Grand titre d'erreur */}
                <h1 className="title is-1 has-text-danger mb-2" style={{ fontSize: '6rem' }}>
                    404
                </h1>
                <h2 className="subtitle is-3 has-text-weight-bold">
                    Page introuvable
                </h2>
                
                <p className="content has-text-grey mb-6">
                    La page que vous recherchez n'existe pas. 
                    
                </p>

               

                {/* Bouton de retour */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="button is-text mt-4"
                >
                    Retour à la page précédente
                </button>
            </div>
        </div>
    );
}