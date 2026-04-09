import { Link, useNavigate } from "react-router-dom";


export function Home() { 
    return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start', 
            paddingTop: '100px' ,
            marginLeft: '50px'
                   
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                {/* La grande boîte  */}
                <div className="box" >


                    {/* Chaque élément sa propre petite boîte */}
                    <Link to="/Clients" >
                    <div className="box mb-2" style={itemStyle}>Clients</div>
                    </Link>
                     <Link to="/Voiture" >
                    <div className="box mb-2" style={itemStyle}>Voitures</div>
                    </Link>
                     <Link to="/Factures" >
                    <div className="box mb-2" style={itemStyle}>Factures</div>
                    </Link>
                     <Link to="/Voiture" >
                    <div className="box mb-2" style={itemStyle}>Employés</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Style pour que les petites boîtes
const itemStyle = {
    padding: '15px',        
    cursor: 'pointer',
    transition: '0.2s',
    border: '1px solid #ddd',
    borderRadius: '12px',    
    marginBottom: '30px',   
    backgroundColor: 'white',
    textAlign: 'center',    
    display: 'block'         
};