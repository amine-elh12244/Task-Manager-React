import { useTheme } from "@mui/material/styles";
import { Box, Button, Grid, IconButton, Paper, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useMemo, useState, useRef } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import SnackbarComponent from "../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import { useGetAllTachesQuery, useUpdateTacheMutation, useCreateTacheMutation, useDeleteTacheMutation } from '../../features/tacheApiSlice';
import React from 'react';
import { CustomTooltip } from "../../components/misc/customTooltip.tsx";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parse } from 'json2csv';
import { saveAs } from 'file-saver';

dayjs.extend(utc);

const exportToPDF = (row) => {
    const doc = new jsPDF();
    doc.text("Tâche", 20, 20);
    doc.text("Détails de la tâche", 20, 30);
    autoTable(doc, {
        startY: 40,
        head: [['Libellé', 'Coefficient', 'Remarques']],
        body: [[row.LibelleTache, row.Coefficient, row.Remarques]]
    });
    doc.text("Signature", 20, doc.lastAutoTable.finalY + 30);
    doc.text("Date", 150, doc.lastAutoTable.finalY + 30);
    doc.save(`${row.LibelleTache}_details.pdf`);
};


const exportAllToPDF = (rows) => {
    const doc = new jsPDF();
    doc.text("Liste des Tâches", 20, 20);
    autoTable(doc, {
        startY: 30,
        head: [['Libellé', 'Coefficient', 'Remarques']],
        body: rows.map(row => [row.LibelleTache, row.Coefficient, row.Remarques])
    });
    doc.save('taches_details.pdf');
};

const exportAllToHTML = (rows) => {
    const htmlContent = `
    <html>
      <head>
        <title>Liste des Tâches</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Liste des Tâches</h2>
        <table>
          <tr><th>Libellé</th><th>Coefficient</th><th>Remarques</th></tr>
          ${rows.map(row => `
            <tr>
              <td>${row.LibelleTache}</td>
              <td>${row.Coefficient}</td>
              <td>${row.Remarques}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'taches_details.html';
    link.click();
};

const exportAllToCSV = (rows) => {
    const formattedRows = rows.map(row => ({
        LibelleTache: row.LibelleTache,
        Coefficient: row.Coefficient,
        Remarques: row.Remarques
    }));

    const fields = ['LibelleTache', 'Coefficient', 'Remarques'];
    const opts = { fields, delimiter: ';' };
    try {
        const csv = parse(formattedRows, opts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
        saveAs(blob, 'taches_details.csv');
    } catch (err) {
        console.error('Error exporting to CSV:', err);
    }
};

const TachesManagement = () => {
    const theme = useTheme();
    const tacheRef = useRef(null);
    const initialTache = useMemo(() => ({ LibelleTache: '', Coefficient: '', Remarques: '' }), []);
    const [editTache, setEditTache] = useState(false);
    const [tacheData, setTacheData] = useState(initialTache);
    const [openModal, setOpenModal] = useState(false);
    const { data: taches = [], isLoading, error } = useGetAllTachesQuery();
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const [deleteTache] = useDeleteTacheMutation();
    const [updateTache] = useUpdateTacheMutation();
    const [createTache] = useCreateTacheMutation();

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

    const handleChangeLibelleTache = (e) => {
        setTacheData({ ...tacheData, LibelleTache: e.target.value });
    };

    const handleChangeCoefficient = (e) => {
        setTacheData({ ...tacheData, Coefficient: e.target.value });
    };

    const handleChangeRemarques = (e) => {
        setTacheData({ ...tacheData, Remarques: e.target.value });
    };

    const handleAddTacheClick = () => {
        setEditTache(false);
        setTacheData(initialTache);
        setOpenModal(true);
    };

    const handleEditTacheClick = (tache) => {
        setEditTache(true);
        setTacheData(tache);
        setOpenModal(true);
    };

    const handleDeleteTacheClick = async (id) => {
        try {
            await deleteTache(id).unwrap();
            onHandleNormalSuccess('Tâche supprimée avec succès');
        } catch (error) {
            onHandleNormalError('Erreur lors de la suppression de la tâche');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are non-null
        const { LibelleTache, Coefficient, Remarques } = tacheData;
        if (!LibelleTache || !Coefficient || !Remarques) {
            // Show an error message if any field is empty
            onHandleNormalError('Tous les champs doivent être remplis.');
            return;
        }

        try {
            if (editTache) {
                await updateTache(tacheData).unwrap();
                onHandleNormalSuccess('Tâche mise à jour avec succès');
            } else {
                await createTache(tacheData).unwrap();
                onHandleNormalSuccess('Tâche ajoutée avec succès');
            }
        } catch (error) {
            onHandleNormalError(editTache ? 'Erreur lors de la mise à jour de la tâche' : 'Erreur lors de l\'ajout de la tâche');
        } finally {
            setOpenModal(false);
        }
    };


    const columns = [
        {
            field: 'LibelleTache',
            headerName: 'Libellé',
            flex: 1,
            align: "center",
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <CustomTooltip title={params.value}>
                    <span>{params.value}</span>
                </CustomTooltip>
            ),
        },
        {
            field: 'Coefficient',
            headerName: 'Coefficient',
            flex: 1,
            align: "center",
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <CustomTooltip title={params.value}>
                    <span>{params.value}</span>
                </CustomTooltip>
            ),
        },
        {
            field: 'Remarques',
            headerName: 'Remarques',
            flex: 1,
            align: "center",
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <CustomTooltip title={params.value}>
                    <span>{params.value}</span>
                </CustomTooltip>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false,
            align: "center",
            disableColumnMenu: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <>
                    <Tooltip title="Edit" placement="top">
                        <IconButton onClick={() => handleEditTacheClick(params.row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                        <IconButton onClick={() => handleDeleteTacheClick(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export" placement="top">
                        <IconButton onClick={() => exportToPDF(params.row)}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Box theme={theme}>
            <Grid container spacing={0}>
                <Grid container spacing={2} ml={1.5} mt={3.8}>
                    <Grid item>
                        <Button
                            onClick={handleAddTacheClick}
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.blue.first,
                                color: theme.palette.white.first,
                                fontWeight: 'bold'
                            }}
                        >
                            Ajouter une tache
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={() => exportAllToPDF(taches)}
                            variant="contained"
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
                            onClick={() => exportAllToHTML(taches)}
                            variant="contained"
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
                            onClick={() => exportAllToCSV(taches)}
                            variant="contained"
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
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, boxShadow: 'none' }}>
                        <Box style={{ height: 429, width: '100%' }}>
                            <DataGrid
                                rows={taches}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5, 10, 20]}
                                loading={isLoading}
                                components={{ Toolbar: GridToolbarQuickFilter }}
                                slots={{ toolbar: QuickSearchToolbar }}
                                componentsProps={{
                                    toolbar: { quickFilterProps: { logicOperator: GridLogicOperator.Or } },
                                }}
                                localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                                ref={tacheRef}
                                sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', } }}

                            />
                        </Box>
                    </Paper>

                    <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                        <DialogTitle>{editTache ? 'Editer Tâche' : 'Ajouter Tâche'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="LibelleTache"
                                label="Libellé"
                                type="text"
                                required
                                fullWidth
                                value={tacheData.LibelleTache}
                                onChange={handleChangeLibelleTache}
                            />
                            <TextField
                                margin="dense"
                                id="Coefficient"
                                label="Coefficient"
                                type="text"
                                required
                                fullWidth
                                value={tacheData.Coefficient}
                                onChange={handleChangeCoefficient}
                            />
                            <TextField
                                margin="dense"
                                id="Remarques"
                                label="Remarques"
                                type="text"
                                required
                                fullWidth
                                value={tacheData.Remarques}
                                onChange={handleChangeRemarques}
                            />
                        </DialogContent>
                        <DialogActions>


                            <Button
                                onClick={handleFormSubmit}
                                sx={{
                                    backgroundColor: theme.palette.blue.first,
                                    color: theme.palette.white.first,
                                    fontWeight: 'bold',
                                    "&:hover": {
                                        backgroundColor: theme.palette.blue.first,
                                    },
                                    marginTop: '20px',
                                    marginLeft: '10px',
                                    textTransform: 'none',
                                }}
                            >
                                {editTache ? 'Mettre à jour' : 'Ajouter'}
                            </Button>
                            <Button
                                onClick={() => setOpenModal(false)}
                                sx={{
                                    backgroundColor: theme.palette.red.first,
                                    color: theme.palette.white.first,
                                    fontWeight: 'bold',
                                    "&:hover": {
                                        backgroundColor: theme.palette.red.first,
                                    },
                                    marginTop: '20px',
                                    marginLeft: '10px',
                                    textTransform: 'none',
                                }}
                            >
                                Annuler
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <SnackbarComponent
                        open={snackbarState.open}
                        handleClose={handleCloseSnackbar}
                        severity={snackbarState.severity}
                        message={snackbarState.message}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default TachesManagement;

function QuickSearchToolbar() {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" p="0rem 0.5rem" width="100%" height="50px">
            <GridToolbarQuickFilter quickFilterParser={(searchInput) => searchInput
                .split(',')
                .map((value) => value.trim())
                .filter((value) => value !== '')
            } sx={{ width: "100%", pt: 1.5, pb: 0, }} />
        </Box>
    );
}


