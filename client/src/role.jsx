import { Link, useNavigate } from "react-router-dom";



export function Roles() { 
     return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '25px'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                
                <div className="box">
                    
                   
                    <Link to="/clients" className="link">
                        <div className="boite is-active">Clients</div>
                    </Link>

                    
                    <Link to="/voitures" className="link">
                        <div className="boite">Voitures</div>
                    </Link>

                    <Link to="/factures" className="link">
                        <div className="boite">Factures</div>
                    </Link>

                    <Link to="/employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                     <Link to="/roles"className="siteactuel" >
                    <div className="boite" >Role</div>
                    </Link>

                </div>
            </div>
        </div>
    );
}