import React, { useEffect, useState } from 'react';
import { Grid, Box } from "@mui/material";
import AjouterEnteteTache from './misc/ajouterEnteteTache.jsx';
import SnackbarComponent from "../../components/misc/snackBar";
import AffecterTache from './misc/affecterTache.jsx';

const AjouterAffectation = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [createdEnteteTache,setCreatedEnteteTache]=useState();
    
    useEffect(()=>{
        console.log("ima genius",createdEnteteTache?.LibelleJournee)
    },[createdEnteteTache])

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSuccess = (message) => {
        setSnackbarSeverity('success');
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleError = (message) => {
        setSnackbarSeverity('error');
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    return (
        <Grid container>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
            <AjouterEnteteTache onSuccess={handleSuccess} onError={handleError} setCreatedEnteteTache={setCreatedEnteteTache}/>
            </Box>
            <Box width="100%" p={3}>
            <AffecterTache enteteId={createdEnteteTache?.EnteteTacheID}
            LibelleJournee={createdEnteteTache?.LibelleJournee}
            entete={createdEnteteTache}
            />
            </Box>
            <SnackbarComponent
                open={snackbarOpen}
                severity={snackbarSeverity}
                message={snackbarMessage}
                handleClose={handleSnackbarClose}
            />
        </Grid>
    );
};

export default AjouterAffectation;
