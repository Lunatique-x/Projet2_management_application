import { Link, useNavigate } from "react-router-dom";


export function Factures() { 
    return (
        <div className="section"> 
            <div className="card-box" style={{ maxWidth: '300px' }}>
                {/* La grande boîte  */}
                <div className="box" style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className="title is-5">Catégories</h3>
                    
                    {/* Chaque élément  sa propre petite boîte */}
                    <div className="box mb-2" style={itemStyle}>Clients</div>
                    <div className="box mb-2" style={itemStyle}>Voitures</div>
                    <div className="box mb-2" style={itemStyle}>Factures</div>
                    <div className="box mb-2" style={itemStyle}>Employés</div>
                </div>
            </div>
        </div>
    );
}

// Style pour que les petites boîtes 
const itemStyle = {
    padding: '10px',
    cursor: 'pointer',
    transition: '0.2s',
    border: '1px solid #ddd'
};