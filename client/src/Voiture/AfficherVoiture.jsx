export function AfficherVoiture(props) {
    const voiture = props.voiture;
    const onEditClick = props.onEditClick;

    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <div
                className="card has-text-black"
                style={{ backgroundColor: "#f5f5f5", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => onEditClick(voiture)}>
                <div className="card-content">
                    <div className="content">
                        <h3 className="title is-4 has-text-centered has-text-black">
                            {voiture.modele}
                        </h3>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Couleur : </span>
                            <span>{voiture.couleur}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Stock : </span>
                            <span>{voiture.stock}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Prix : </span>
                            <span>{voiture.prix} $</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}