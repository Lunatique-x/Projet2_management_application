export function AfficherClient(props) {
    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <div className="card has-text-black">
                <figure className="image is-square">
                    <img src={props.client.imgUrl ? props.client.imgUrl : "./assets/client_default_copie.PNG"} alt={props.client.full_name} />
                </figure>
            </div>
            <div className="card-content">
                <div className="content">
                    <h3 className="title is-3 has-text-centered has-text-black">
                        {props.client.full_name}
                    </h3>
                    <div className="mb-0">
                        <span className="has-text-weight-bold">Email : </span>
                        <span>{props.client.email}</span>
                    </div>
                    <div className="mb-0">
                        <span className="has-text-weight-bold">Téléphone : </span>
                        <span>{props.client.phone}</span>
                    </div>
                </div>
          </div>
        </div>
    );
};