import { Link, useNavigate } from "react-router-dom";



export function Voiture() { 
    return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '50px'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                
                <div className="box">
                    
                   
                    <Link to="/Client" className="link">
                        <div className="boite ">Clients</div>
                    </Link>

                    
                    <Link to="/Voiture" className="siteactuel">
                        <div className="boite">Voitures</div>
                    </Link>

                    <Link to="/Facture" className="link">
                        <div className="boite">Factures</div>
                    </Link>

                    <Link to="/Employe" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}