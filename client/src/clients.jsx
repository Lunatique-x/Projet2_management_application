import { Link } from "react-router-dom";
import "./app.css"; 

export function Clients() {
    return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '50px'
        }}>
            <div className="card-box" style={{ width: '300px' }}>
                
                <div className="box">
                    
                   
                    <Link to="/Clients" className="siteactuel">
                        <div className="boite is-active">Clients</div>
                    </Link>

                    
                    <Link to="/Voiture" className="link">
                        <div className="boite">Voitures</div>
                    </Link>

                    <Link to="/Factures" className="link">
                        <div className="boite">Factures</div>
                    </Link>

                    <Link to="/Employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}