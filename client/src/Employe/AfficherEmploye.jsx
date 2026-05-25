export function AfficherEmploye(props) {
    const employe = props.employe;

    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <div
                className="card has-text-black"
                style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', cursor: props.onEditClick ? 'pointer' : 'default' }}
                onClick={() => props.onEditClick && props.onEditClick(employe)}
            >
                <div className="card-content">
                    <div className="content">
                        <h3 className="title is-4 has-text-centered has-text-black">
                            {employe.full_name}
                        </h3>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Email : </span>
                            <span>{employe.email}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Téléphone : </span>
                            <span>{employe.phone}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Date d'embauche : </span>
                            <span>{employe.date_embauche}</span>
                        </div>
                        <div className="mb-0">
                            <span className="has-text-weight-bold">Commission : </span>
                            <span>{employe.commission}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
