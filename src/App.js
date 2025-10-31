import React, { useRef } from 'react';
import CompteList from './components/CompteList';
import CompteForm from './components/CompteForm';

function App() {
  const compteListRef = useRef(null);

  // Fonction pour actualiser la liste des comptes après ajout
  const handleCompteAdded = () => {
    if (compteListRef.current) {
      compteListRef.current.refresh();
    }
  };

  return (
    <div>
      <CompteForm onCompteAdded={handleCompteAdded} />
      <CompteList ref={compteListRef} />
    </div>
  );
}

export default App;
