import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme
} from "@mui/material";
import { useCreateEnteteTacheMutation } from '../../../features/tacheApiSlice';
import { useGetAllUtilisateursQuery } from '../../../features/utilisateurApiSlice';
import dayjs from 'dayjs';

const AjouterEnteteTache = ({ onSuccess, onError, setCreatedEnteteTache }) => {
    const theme = useTheme();
    const initialTache = { LibelleJournee: '', DateOperation: '', Remarques: '', UtilisateurID: '' };
    const [tacheData, setTacheData] = useState(initialTache);
    const { data: utilisateurs = [], isLoading: isLoadingUtilisateurs } = useGetAllUtilisateursQuery();
    const [createEnteteTache] = useCreateEnteteTacheMutation();

    const handleChangeLibelleJournee = (e) => {
        setTacheData({ ...tacheData, LibelleJournee: e.target.value });
    };

    const handleChangeDateOperation = (e) => {
        setTacheData({ ...tacheData, DateOperation: e.target.value });
    };

    const handleChangeRemarques = (e) => {
        setTacheData({ ...tacheData, Remarques: e.target.value });
    };

    const handleChangeUtilisateur = (e) => {
        setTacheData({ ...tacheData, UtilisateurID: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { LibelleJournee, DateOperation, UtilisateurID } = tacheData;

        // Check if all required fields are filled
        if (!LibelleJournee || !DateOperation || !UtilisateurID) {
            onError("Tous les champs requis doivent être remplis.");
            return;
        }

        try {
            const res = await createEnteteTache({
                ...tacheData,
                DateOperation: dayjs(tacheData.DateOperation).format('YYYY-MM-DD')
            });
            if (res?.data?.message) {
                onSuccess(res.data.message);
                setTacheData(initialTache);
                setCreatedEnteteTache(res.data.EnteteTache);
            } else {
                onError("Failed to create entete tache");
            }
        } catch (error) {
            onError("An error occurred while creating the entete tache");
        }
    };
    const isFormValid = () => {
        const { LibelleJournee, DateOperation, UtilisateurID } = tacheData;
        return LibelleJournee && DateOperation && UtilisateurID;
    };

    return (
        <Box width="400px">
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Libellé Journée"
                    variant="outlined"
                    value={tacheData.LibelleJournee}
                    onChange={handleChangeLibelleJournee}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date d'Opération"
                    type="date"
                    variant="outlined"
                    value={tacheData.DateOperation}
                    onChange={handleChangeDateOperation}
                    required
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Remarques"
                    variant="outlined"
                    value={tacheData.Remarques}
                    onChange={handleChangeRemarques}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="Utilisateur-label">Utilisateur</InputLabel>
                    <Select
                        labelId="Utilisateur-label"
                        id="Utilisateur-select"
                        value={tacheData.UtilisateurID}
                        onChange={handleChangeUtilisateur}
                        label="Utilisateur"
                    >
                        {utilisateurs.map((user) => (
                            <MenuItem key={user.UtilisateurID} value={user.UtilisateurID}>{user.Nom}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box display="flex" justifyContent="center" mt={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: theme.palette.blue.first,
                            color: theme.palette.white.first,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: theme.palette.blue.first,
                                color: theme.palette.white.first
                            }
                        }}
                        disabled={!isFormValid()}
                    >
                        Ajouter
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AjouterEnteteTache;
