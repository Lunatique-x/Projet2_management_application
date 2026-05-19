export function Pagination({ totalShows, showsPerPage, setShowsPerPage, currentPage, paginate }) {
  const totalPages = Math.ceil(totalShows / showsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  if (totalPages === 0) return null;

  return (
    <div className="level mt-6" role="region" aria-label="Contrôles de pagination de la liste">
      {/* Liste des numéros à gauche */}
      <div className="level-left">
        <nav className="pagination is-small" role="navigation" aria-label="Pagination des pages">
          <ul className="pagination-list">
            {pageNumbers.map(number => (
              <li key={number}>
                <button 
                  onClick={() => paginate(number)}
                  className={`pagination-link ${currentPage === number ? 'is-current' : ''}`}
                  title={`Aller à la page ${number}`}
                  aria-label={`Page ${number}`}
                  aria-current={currentPage === number ? 'page' : undefined}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sélecteur de nombre par page au centre */}
      <div className="level-item">
        <div className="field is-horizontal is-align-items-center">
          <div className="field-body">
            <div className="control">
              <div className="select is-small">
                <select 
                  value={showsPerPage} 
                  onChange={(e) => setShowsPerPage(parseInt(e.target.value))}
                  title="Modifier le nombre d'éléments affichés par page"
                  aria-label="Nombre d'éléments affichés par page"
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons Précédent/Suivant à droite */}
      <div className="level-right">
        <div className="field has-addons" role="group" aria-label="Navigation entre la page précédente et suivante">
          <p className="control">
            <button 
              className="button is-small" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              title="Page précédente"
              aria-label="Aller à la page précédente"
            >
              <span className="icon" aria-hidden="true">
                <i className="fas fa-chevron-left"></i>
              </span>
            </button>
          </p>
          <p className="control">
            <button 
              className="button is-small" 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Page suivante"
              aria-label="Aller à la page suivante"
            >
              <span className="icon" aria-hidden="true">
                <i className="fas fa-chevron-right"></i>
              </span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
