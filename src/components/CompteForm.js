import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteForm({ onCompteAdded }) {
  // Initialisation de l'état pour stocker les données du formulaire
  const [compte, setCompte] = useState({ solde: '', dateCreation: '', type: 'COURANT' });

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    // Validation: vérifier que tous les champs sont remplis
    if (!compte.solde || !compte.dateCreation || !compte.type) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    axios.post(`${API_BASE_URL}/comptes`, compte) // Envoie une requête POST avec les données
      .then(response => {
        alert('Compte ajouté avec succès!');
        // Réinitialiser le formulaire après succès
        setCompte({ solde: '', dateCreation: '', type: 'COURANT' });
        // Notifier le parent pour actualiser la liste
        if (onCompteAdded) {
          onCompteAdded();
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du compte:', error);
        alert('Erreur lors de l\'ajout du compte. Veuillez réessayer.');
      }); // Gestion des erreurs
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Compte</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Solde</label>
          <input type="number" name="solde" className="form-control" value={compte.solde} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Date de Création</label>
          <input type="date" name="dateCreation" className="form-control" value={compte.dateCreation} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select name="type" className="form-select" value={compte.type} onChange={handleChange}>
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default CompteForm;