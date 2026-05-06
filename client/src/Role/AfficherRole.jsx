export function AfficherRole(props) {
    const role = props.role;

    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <div
                className="card has-text-black"
                style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', cursor: 'pointer' }}
                onClick={() => props.onEditClick(props.role)}
            >
                <div className="card-content">
                    <div className="content">
                        <h3 className="title is-4 has-text-centered has-text-black">
                            {role.nom}
                        </h3>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Voir Stock : </span>
                            <span>{role.seeStock ? '✓' : '✗'}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Voir Clients : </span>
                            <span>{role.seeClients ? '✓' : '✗'}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Modifier Stock : </span>
                            <span>{role.modStock ? '✓' : '✗'}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Modifier Clients : </span>
                            <span>{role.modClients ? '✓' : '✗'}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Modifier Vente : </span>
                            <span>{role.modSell ? '✓' : '✗'}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Ajouter Client : </span>
                            <span>{role.addClient ? '✓' : '✗'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
