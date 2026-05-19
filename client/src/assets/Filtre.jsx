export function Filter({ placeholderText, rechercheValue, onRechercheChange }) {
    return (
        <div className="columns is-vcentered is-mobile">
            <div className="column is-4">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        placeholder={placeholderText}
                        value={rechercheValue}
                        onChange={onRechercheChange}
                    />
                    <span className="icon is-left">
                        <i className="fas fa-search"></i>
                    </span>
                </div>
            </div>
        </div>
    );
}
