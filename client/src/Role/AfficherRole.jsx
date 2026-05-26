// export function AfficherRole(props) {
//     const role = props.role;

//     return (
//         <div className="column is-3-desktop is-4-tablet is-6-mobile">
//             <div
//                 className="card has-text-black"
//                 style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', cursor: 'pointer' }}
//                 onClick={() => props.onEditClick(props.role)}
//             >
//                 <div className="card-content">
//                     <div className="content">
//                         <h3 className="title is-4 has-text-centered has-text-black">
//                             {role.nom}
//                         </h3>
//                         {/* Voire */}
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Voir Stock : </span>
//                             <span>{role.viewStock ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Voir Clients : </span>
//                             <span>{role.viewClients ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Voir les Ventes : </span>
//                             <span>{role.viewSell ? '✓' : '✗'}</span>
//                         </div>
//                         {/* Modification */}
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Modifier Stock : </span>
//                             <span>{role.modStock ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Modifier Clients : </span>
//                             <span>{role.modClients ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Modifier Vente : </span>
//                             <span>{role.modSell ? '✓' : '✗'}</span>
//                         </div>
//                         {/* Ajouter */}
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Ajouter au Stock : </span>
//                             <span>{role.addStock ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Ajouter Client : </span>
//                             <span>{role.addClient ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Ajouter une Vente : </span>
//                             <span>{role.addSell ? '✓' : '✗'}</span>
//                         </div>
//                         {/* Supprimer */}
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Supprimer du Stock : </span>
//                             <span>{role.delStock ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Supprimer les Clients : </span>
//                             <span>{role.delClients ? '✓' : '✗'}</span>
//                         </div>
//                         <div className="mb-0">
//                             <span className="has-text-weight-bold">Supprimer une Vente : </span>
//                             <span>{role.delSell ? '✓' : '✗'}</span>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

export function AfficherRole(props) {
    const role = props.role;

    return (
        <div className="column is-4-desktop is-6-tablet is-12-mobile">
            <div
                className="card has-text-black has-background-white-ter is-clickable"
                onClick={() => props.onEditClick(props.role)}
            >
                <div className="card-content">
                    <div className="content">
                        {/* Titre principal */}
                        <h3 className="title is-4 has-text-centered has-text-black mb-5">
                            {role.nom}
                        </h3>

                        {/* Grille Bulma : 3 colonnes pour diviser l'espace */}
                        <div className="columns is-mobile is-multiline">
                            
                            {/* Colonne Stock */}
                            <div className="column is-4">
                                <p className="heading has-text-weight-bold has-text-grey-dark mb-2"> Stock</p>
                                <p className="is-size-7 mb-1">Voir: {role.viewStock ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Ajout: {role.addStock ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Modif: {role.modStock ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Suppr: {role.delStock ? '✓' : '✗'}</p>
                            </div>

                            {/* Colonne Clients */}
                            <div className="column is-4">
                                <p className="heading has-text-weight-bold has-text-grey-dark mb-2"> Clients</p>
                                <p className="is-size-7 mb-1">Voir: {role.viewClients ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Ajout: {role.addClient ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Modif: {role.modClients ? '✓' :'✗'}</p>
                                <p className="is-size-7 mb-1">Suppr: {role.delClients ? '✓' : '✗'}</p>
                            </div>

                            {/* Colonne Ventes */}
                            <div className="column is-4">
                                <p className="heading has-text-weight-bold has-text-grey-dark mb-2"> Ventes</p>
                                <p className="is-size-7 mb-1">Voir: {role.viewSell ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Ajout: {role.addSell ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Modif: {role.modSell ? '✓' : '✗'}</p>
                                <p className="is-size-7 mb-1">Suppr: {role.delSell ? '✓' : '✗'}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}