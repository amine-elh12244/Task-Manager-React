import { useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import SnackbarComponent from "../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import { useDeleteEnteteTacheMutation, useGetAllEntetesTachesQuery, useUpdateEnteteTacheMutation, useCreateEnteteTacheMutation } from '../../features/tacheApiSlice';
import { useGetAllUtilisateursQuery } from '../../features/utilisateurApiSlice';
import React from 'react';
import { CustomTooltip } from "../../components/misc/customTooltip.tsx";
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';
import AssignTaskDialog from './misc/assignTaskDialog';
import TachesParEntete from "./misc/tachesParEntete";
import Papa from 'papaparse';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// Helper function to format dates
const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD à HH:mm');
};

const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);

const exportToPDF = (row) => {
    const randomNumber = generateRandomNumber();
    const doc = new jsPDF();
    doc.text("Détails de la tâche", 20, 20);
    doc.autoTable({
        startY: 30,
        head: [['Libellé Journée', 'Date d\'Opération', 'Remarques', 'Utilisateur']],
        body: [[
            row.LibelleJournee,
            formatDate(row.DateOperation),
            row.Remarques,
            row.Utilisateur
        ]]
    });
    doc.text("Signature", 20, doc.lastAutoTable.finalY + 30);
    doc.text("Date", 150, doc.lastAutoTable.finalY + 30);
    doc.save(`Entete-Tache_${randomNumber}.pdf`);
};

const exportAllToPDF = (rows) => {
    const randomNumber = generateRandomNumber();
    const doc = new jsPDF();
    doc.text("Liste des Entêtes-Tâches", 20, 20);
    doc.autoTable({
        startY: 30,
        head: [['Libellé Journée', 'Date d\'Opération', 'Remarques', 'Utilisateur']],
        body: rows.map(row => [
            row.LibelleJournee,
            formatDate(row.DateOperation),
            row.Remarques,
            row.UtilisateurNom
        ])
    });
    doc.save(`Liste_des_Entetes-Taches_${randomNumber}.pdf`);
};

const exportAllToHTML = (rows) => {
    const randomNumber = generateRandomNumber();
    const htmlContent = `
    <html>
      <head>
        <title>Liste des Entêtes-Tâches</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Liste des Entêtes-Tâches</h2>
        <table>
          <tr><th>Libellé Journée</th><th>Date d'Opération</th><th>Remarques</th><th>Utilisateur</th></tr>
          ${rows.map(row => `
            <tr>
              <td>${row.LibelleJournee}</td>
              <td>${formatDate(row.DateOperation)}</td> <!-- Format the date here -->
              <td>${row.Remarques}</td>
              <td>${row.UtilisateurNom}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Liste_des_Entetes-Taches_${randomNumber}.html`;
    link.click();
};

const exportAllToCSV = (rows) => {
    const randomNumber = generateRandomNumber();
    const fields = ['LibelleJournee', 'DateOperation', 'Remarques', 'UtilisateurNom'];

    try {
        // Convert rows to CSV format using PapaParse
        const csv = Papa.unparse(rows, { header: true, delimiter: ';' });

        // Create a Blob with UTF-8 encoding
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Use saveAs to prompt the user to download the CSV file
        saveAs(blob, `Liste_des_Entetes-Taches_${randomNumber}_details.csv`);
    } catch (err) {
        console.error('Error exporting to CSV:', err);
    }
};

const GestionTaches = () => {
    const theme = useTheme();
    const initialTache = useMemo(() => ({ LibelleJournee: '', DateOperation: '', Remarques: '', Utilisateur: '' }), []);
    const [editTache, setEditTache] = useState(false);
    const [tacheData, setTacheData] = useState({ LibelleJournee: '', DateOperation: '', Remarques: '', UtilisateurID: '' });
    const [openModal, setOpenModal] = useState(false);
    const [openAssignTaskDialog, setOpenAssignTaskDialog] = useState(false);
    const { data: entetestaches = [], isLoading, error, refetch } = useGetAllEntetesTachesQuery();
    const { data: utilisateurs = [], isLoading: isLoadingUtilisateurs } = useGetAllUtilisateursQuery();
    const [createEnteteTache] = useCreateEnteteTacheMutation();
    const [tacheDenteteopen, setTacheDenteteopen] = useState(null);
    const [tacheDenteteopenData,setTacheDenteteopenData]=useState(null);
    const [updateEnteteTache] = useUpdateEnteteTacheMutation();
    const [deleteEnteteTache] = useDeleteEnteteTacheMutation();
    const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState(null);

    console.log("selectedTaskForAssignment", selectedTaskForAssignment)

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteteTache = { ...tacheData };
        try {
            const res = await createEnteteTache(enteteTache);
            if (res?.data?.message) {
                onHandleNormalSuccess(res?.data?.message);
                resetTacheData();
                setOpenModal(false);
            } else {
                onHandleNormalError(res?.error?.data?.message);
            }
        } catch (error) {
            onHandleNormalError("An error occurred while creating the entete tache");
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const tache = {
            ...tacheData,
            DateOperation: dayjs(tacheData.DateOperation).format('YYYY-MM-DD')
        };

        try {
            const res = await updateEnteteTache(tache);

            if (res?.data?.message) {
                onHandleNormalSuccess(res?.data?.message);
                resetTacheData();
                setEditTache(false);
                setOpenModal(false);
                refetch();
            } else {
                onHandleNormalError(res?.error?.data?.message);
            }
        } catch (error) {
            onHandleNormalError("An error occurred while updating the task");
        }
    };





    const handleDelete = async (id) => {
        try {
            const res = await deleteEnteteTache(id);
            if (res?.data?.message) {
                onHandleNormalSuccess(res?.data?.message);
                refetch();
            } else {
                onHandleNormalError(res?.error?.data?.message);
            }
        } catch (error) {
            onHandleNormalError("An error occurred while deleting the task");
        }
    };


    const resetTacheData = () => {
        setTacheData(initialTache);
    };

    const handleCloseModal = () => {
        resetTacheData();
        setOpenModal(false);
        setEditTache(false);
    };

    const onHandleNormalError = (errorMessage) => {
        setSnackbarState({
            open: true,
            severity: 'error',
            message: errorMessage,
        });
    };

    const onHandleNormalSuccess = (successMessage) => {
        setSnackbarState({
            open: true,
            severity: 'success',
            message: successMessage,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    const handleChangeLibelleJournee = (e) => {
        setTacheData({ ...tacheData, LibelleJournee: e.target.value });
    };



    const handleChangeRemarques = (e) => {
        setTacheData({ ...tacheData, Remarques: e.target.value });
    };


    useEffect(() => {
        if (editTache) {
            console.log('Editing Task:', tacheData);
        }
    }, [editTache, refetch]);


    const handleChangeDateOperation = (e) => {
        console.log('DateOperation Change:', e.target.value);
        setTacheData({ ...tacheData, DateOperation: e.target.value });
    };

    const handleChangeUtilisateur = (e) => {
        console.log('Utilisateur Change:', e.target.value);
        setTacheData({ ...tacheData, UtilisateurID: e.target.value });
    };


    const columns = [
        { field: 'LibelleJournee', headerName: 'Libellé Journée', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.LibelleJournee}>{row.LibelleJournee}</CustomTooltip>) },
        {
            field: 'DateOperation',
            headerName: 'Date d\'Opération',
            flex: 1,
            align: 'center',
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.DateOperation).format('YYYY-MM-DD');// [à] HH:mm
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        { field: 'Remarques', headerName: 'Remarques', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Remarques}>{row.Remarques}</CustomTooltip>) },
        { field: 'Utilisateur', headerName: 'Utilisateur', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.UtilisateurNom}>{row.UtilisateurNom}</CustomTooltip>) },
        {
            field: 'actions', headerName: 'Actions', width: 190, align: 'center', headerClassName: 'bold-weight',
            renderCell: ({ row }) => (
                <Box display="flex" justifyContent="center">
                    <Tooltip title="Editer">
                        <IconButton color="primary" onClick={() => { setEditTache(true); setTacheData(row); setOpenModal(true); }}>
                            <EditIcon />
                        </IconButton>

                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton color="secondary" onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exporter en PDF">
                        <IconButton onClick={() => exportToPDF(row)}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Afficher les Tâches">
                        <IconButton color="info" onClick={() => { setTacheDenteteopen(row.id);
                            setTacheDenteteopenData(row);
                         }}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Assigner une Tâche">
                        <IconButton color="primary" onClick={() => handleAssignTaskDialogOpen(row)}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    const handleAssignTaskDialogOpen = (row) => {
        setSelectedTaskForAssignment(row);
        setOpenAssignTaskDialog(true);
    };


    const handleAssignTaskDialogClose = () => {
        setOpenAssignTaskDialog(false);
    };

    const handleAssignTaskSubmit = (taskFields) => {
        console.log('Task Fields:', taskFields);
        // Add functionality for task assignment
    };
    const handleCloseTachesParEnteteModal = () => {
        setTacheDenteteopen(null); // Close modal and reset state
    };


    return (
        <Box p={4}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box mb={4}>
                        <Grid container spacing={2} >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => exportAllToPDF(entetestaches)}
                                    sx={{
                                        backgroundColor: theme.palette.blue.first,
                                        color: theme.palette.white.first,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Exporter PDF
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => exportAllToHTML(entetestaches)}
                                    sx={{
                                        backgroundColor: theme.palette.blue.first,
                                        color: theme.palette.white.first,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Exporter HTML
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => exportAllToCSV(entetestaches)}
                                    sx={{
                                        backgroundColor: theme.palette.blue.first,
                                        color: theme.palette.white.first,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Exporter CSV
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <div style={{ height: 440, width: '100%' }}>
                        <DataGrid
                            rows={entetestaches}
                            columns={columns}
                            pageSize={6}
                            loading={isLoading}
                            rowsPerPageOptions={[6]}
                            components={{ Toolbar: GridToolbarQuickFilter }}
                            initialState={{
                                filter: {
                                    filterModel: {
                                        items: [],
                                        quickFilterLogicOperator: GridLogicOperator.Or,
                                    },
                                },
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 6 },
                                },
                            }}
                            slots={{ toolbar: (props) => <QuickSearchToolbar {...props} /> }}
                            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </div>
                </Grid>
            </Grid>

            {/* Modal for Adding/Editing Task */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
                <DialogTitle>{editTache ? 'Modifier la Tâche' : 'Ajouter une Entête Tâche'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={editTache ? handleSubmitEdit : handleSubmit} sx={{ mt: 2 }}>
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


                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}
                        sx={{
                            backgroundColor: theme.palette.red.first,
                            color: theme.palette.white.first,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: theme.palette.red.first,
                                color: theme.palette.white.first
                            }
                        }}
                    >Annuler</Button>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.blue.first,
                            color: theme.palette.white.first,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: theme.palette.blue.first,
                                color: theme.palette.white.first
                            }
                        }}
                        type="submit" onClick={editTache ? handleSubmitEdit : handleSubmit} color="primary"
                    >
                        {editTache ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>


            <AssignTaskDialog
                open={openAssignTaskDialog}
                onClose={handleAssignTaskDialogClose}
                tache={selectedTaskForAssignment}
                onSubmit={handleAssignTaskSubmit}
                variant={"ajouter"}
            />

            {/* Modal to display TachesParEntete */}
            <Dialog open={tacheDenteteopen !== null} onClose={handleCloseTachesParEnteteModal} maxWidth="md" fullWidth>
                <DialogTitle>Liste des Tâches</DialogTitle>
                <DialogContent>
                    <TachesParEntete enteteId={tacheDenteteopen} entete={tacheDenteteopenData} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTachesParEnteteModal} color="primary" sx={{
                        backgroundColor: theme.palette.red.first,
                        color: theme.palette.white.first,
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: theme.palette.red.first,
                            color: theme.palette.white.first
                        }
                    }}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar */}
            <SnackbarComponent
                open={snackbarState.open}
                handleClose={handleCloseSnackbar}
                message={snackbarState.message}
                severity={snackbarState.severity}

            />
        </Box>
    );
};

function QuickSearchToolbar() {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p="0rem 0.5rem"
            width="100%"
            height="50px"
        >
            <GridToolbarQuickFilter
                quickFilterParser={(searchInput) =>
                    searchInput
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                }
                sx={{
                    width: "100%",
                    pt: 1.5,
                    pb: 0,

                }}
            />

        </Box>
    );
}


export default GestionTaches;
