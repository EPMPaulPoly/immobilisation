import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Histoire from './pages/Histoire.js';
import VisualisationInventaire from './pages/VisualisationInventaire.js';
import Reglements from './pages/Reglements.js';
import EnsemblesReglements from './pages/EnsemblesReglements.js';
import EnsRegTerritoire from './pages/EnsRegTerr.js';
import AnalyseQuartiers from './pages/AnalyseQuartiers.js';
import AnalyseReglements from './pages/AnalyseReglements.js';
import AnalyseVariabilite from './pages/AnalyseVariabilite.js';
import { FournisseurContexte } from './contexte/ContexteImmobilisation.js';
import ValidationStatistique from './pages/validationStatistique.js';
import SommaireValidation from './pages/SommaireValidation.js';
import VersementSecAnalyse from './pages/VersementSecAnalyse.js';
const app: React.FC = () => {
  return (
    <FournisseurContexte>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/historique" />} />
          <Route path="/historique" element={<Histoire />} />
          <Route path="/inventaire" element={<VisualisationInventaire/>}/>
          <Route path="/reg" element={<Reglements/>}/>
          <Route path="/ens-reg" element={<EnsemblesReglements/>}/>
          <Route path="/ens-reg-terr" element={<EnsRegTerritoire/>}/>
          <Route path="/ana-reg" element={<AnalyseReglements/>}/>
          <Route path="/ana-var" element={<AnalyseVariabilite/>}/>
          <Route path="/ana-quartiers" element={<AnalyseQuartiers/>}/>
          <Route path="/valid-stat" element ={<ValidationStatistique/>}/>
          <Route path="/sommaire-valid" element={<SommaireValidation/>}/>
          <Route path="/sec-analyse-verse" element={<VersementSecAnalyse/>}/>
        </Routes>
      </Router>
    </FournisseurContexte>
  );
};

export default app;