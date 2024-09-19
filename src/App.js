import React from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from './components/Login';
import RequireAuth from './utils/RequireAuth';
import Layout from "scenes/layout";

import FamilyManagement from "scenes/familleUtilisateur/index";
import UserManagement from "scenes/admin/index";
import NotFound from 'NotFound';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from 'features/auth/authSlice';
import { isAdmin } from 'utils/Roles';
import UtilisateurManagement from 'scenes/utilisateur';
import TachesManagement from 'scenes/Taches';
import Calendrier from 'scenes/calendrier';
import GestionTaches from 'scenes/gestion_taches';
import TableauDeBord from 'scenes/tableau_de_bord/tableauDeBord';
import AjouterAffectation from 'scenes/affectation/ajouterAffectation';


function App() {

  const theme = useMemo(() => createTheme(themeSettings()), []);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Routes>
            {/* public routes */}
            <Route path="/" element={<LoginRedirect />} />

            {/* protected routes */}
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                {isAdmin(user|| storedUser) &&<> <Route path="/gestion-des-utlisateurs" element={<UserManagement />} />
                <Route path="*" element={<NotFound />} />
                </>}
                {isAdmin(user|| storedUser) &&
                  <>
                    {/* <Route path="/clients" element={<ClientList />} /> */}
                    <Route path="*" element={<NotFound />} />
                    <Route path="/famille-utilisateur" element={<FamilyManagement />} />
                    <Route path="/utilisateurs" element={<UtilisateurManagement />} />
                    <Route path="/taches" element={<TachesManagement />} />
                    <Route path="/calendrier" element={<Calendrier />} />
                    <Route path="/gestion-taches" element={<GestionTaches />} />
                    <Route path="/tableau-de-bord" element={<TableauDeBord />} />
                    <Route path="/ajouter-une-affectation" element={<AjouterAffectation/>} />
                    
                  </>
                }
              </Route>
              <Route path="/*" element={<NotFound />} />

            </Route>

          </Routes>

        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

const LoginRedirect = () => {
  const storedToken = localStorage.getItem("authToken");
  const token = useSelector(selectCurrentToken)|| storedToken;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = useSelector(selectCurrentUser);  
  
  return token||user ? <Navigate to={isAdmin(user||storedUser) ? "/utilisateurs" : "/clients"} replace /> : <Login />;
};