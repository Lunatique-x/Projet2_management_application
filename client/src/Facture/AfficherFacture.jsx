export function AfficherFacture(props) {
    const facture = props.facture;

    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <div
                className="card has-text-black"
                style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', cursor: 'pointer' }}
                onClick={() => props.onEditClick(props.facture)}
            >
                <div style={{ height: '5px', backgroundColor: '#000000', borderRadius: '5px 5px 0 0' }}></div>

                <div className="card-content">
                    <div className="content">
                        <h3 className="title is-5 has-text-centered has-text-black mb-5">
                            FACTURE #{facture.id_payement}
                        </h3>
                        
                        <div className="mb-2">
                            <span className="has-text-weight-bold"> Date : </span>
                            <span>{new Date(facture.date_creation).toLocaleDateString()}</span>
                        </div>

                        {/* Affichage du nom complet du Client */}
                        <div className="mb-2">
                            <span className="has-text-weight-bold"> Client : </span>
                            <span>{facture.client_nom || 'Inconnu'}</span>
                        </div>

                        {/* Affichage du modèle de la voiture */}
                        <div className="mb-2">
                            <span className="has-text-weight-bold"> Voiture : </span>
                            <span>{facture.voiture_modele || 'N/A'}</span>
                        </div>

                        {/* Affichage du nom complet de l'Employé */}
                        <div className="mb-2">
                            <span className="has-text-weight-bold"> Vendu par : </span>
                            <span>{facture.employe_nom || 'N/A'}</span>
                        </div>

                        <div className="notification is-warning is-light p-2 mt-3">
                            <p className="is-size-7 mb-0">
                                 <strong>Garantie : </strong> 
                                {facture.date_fin_garantie 
                                    ? new Date(facture.date_fin_garantie).toLocaleDateString() 
                                    : 'Non spécifiée'}
                            </p>
                        </div>

                        <hr style={{ margin: '15px 0', backgroundColor: '#dbdbdb' }} />

                        <div className="has-text-centered">
                            <p className="heading mb-0">Prix de vente</p>
                            <span className="is-size-4 has-text-weight-bold has-text-success">
                                {facture.prix_vente.toLocaleString()} $
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
