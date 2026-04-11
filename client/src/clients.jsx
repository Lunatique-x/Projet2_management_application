import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AfficherClient } from "./AfficherClient";
 

export function Clients() {
    const [client, setClient] = useState([]);
    useEffect(() => {
        async function getClient() {
            const res = await fetch("http://localhost:3000/client", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setClient(data);
            }
        }
        getClient();
    }, []);




    return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '50px'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                
                <div className="box">
                    
                   
                    <Link to="/Client" className="siteactuel">
                        <div className="boite ">Clients</div>
                    </Link>

                    
                    <Link to="/Voiture" className="link">
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
            <div className="container">
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {client.map((c) => {
                            return <AfficherClient key={c.id_client} client={c} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}