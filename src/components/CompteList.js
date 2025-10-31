import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const CompteList = forwardRef((props, ref) => {
  // Déclaration d'un état pour stocker les comptes
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les comptes depuis l'API
  const fetchComptes = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/comptes`, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        setComptes(response.data); // Mise à jour de l'état avec les données récupérées
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des comptes:', error);
        setError('Erreur lors de la récupération des comptes');
        setLoading(false);
      });
  };

  // Exposer la fonction fetchComptes via ref pour permettre le rafraîchissement depuis le parent
  useImperativeHandle(ref, () => ({
    refresh: fetchComptes
  }));

  // Utilisation de useEffect pour effectuer un appel à l'API dès le chargement
  useEffect(() => {
    fetchComptes();
  }, []); // Le tableau vide indique que l'effet s'exécute uniquement au montage du composant

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Fonction pour formater le type
  const formatType = (type) => {
    const types = {
      'COURANT': 'Courant',
      'EPARGNE': 'Épargne'
    };
    return types[type] || type;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Liste des Comptes</h2>
        <button 
          className="btn btn-secondary" 
          onClick={fetchComptes}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {comptes.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Aucun compte trouvé.
            </div>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Solde</th>
                  <th>Date de Création</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {comptes.map(compte => (
                  <tr key={compte.id}>
                    <td>{compte.id}</td>
                    <td>{compte.solde ? `${compte.solde} DH` : '-'}</td>
                    <td>{formatDate(compte.dateCreation)}</td>
                    <td>{formatType(compte.type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
});

export default CompteList;