import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme,
    Snackbar,
    Grid,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useGetAllTachesWithDetailsByIdQuery, useUpdateTacheMutation, useDeleteDetailsTacheMutation } from '../../../features/tacheApiSlice';
import AssignTaskDialog from './assignTaskDialog';
import { CustomTooltip } from "../../../components/misc/customTooltip.tsx";
import dayjs from "dayjs";
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';
import SnackbarComponent from "../../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import 'jspdf-autotable';

const TachesParEntete = ({ enteteId ,entete}) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTache, setSelectedTache] = useState(null);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteTache] = useDeleteDetailsTacheMutation();
    const [updateTache] = useUpdateTacheMutation();
    const {
        data: taches = [],
        isLoading,
        error,
        refetch
    } = useGetAllTachesWithDetailsByIdQuery(enteteId, {
        skip: !enteteId
    });

    console.log("entete",entete);
    // Function to handle normal success messages
    const onHandleNormalSuccess = (successMessage) => {
        setSnackbarState({
            open: true,
            severity: 'success',
            message: successMessage,
        });
    };

    // Function to handle normal error messages
    const onHandleNormalError = (errorMessage) => {
        setSnackbarState({
            open: true,
            severity: 'error',
            message: errorMessage,
        });
    };

    // Function to close snackbar
    const handleCloseSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    // Function to refetch data
    const refetchData = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

    // Effect to refetch data when enteteId changes
    useEffect(() => {
        if (enteteId) {
            refetchData();
        }
    }, [enteteId]);

    // Function to handle edit task click
    const handleEditTacheClick = (tache) => {
        setSelectedTache(tache);
        setOpenDialog(true);
    };

    // Function to handle delete task click
    const handleDeleteTacheClick = (id) => {
        setSelectedTache(id); // Store selected task ID for delete confirmation
        setConfirmDeleteOpen(true);
    };

    // Function to confirm delete action
    const handleDelete = async () => {
        try {
            await deleteTache(selectedTache).unwrap();
            onHandleNormalSuccess('Tâche supprimée avec succès');
            await refetchData();
            setConfirmDeleteOpen(false);
        } catch (error) {
            onHandleNormalError('Erreur lors de la suppression de la tâche');
        }
    };

    // Function to update task
    const handleUpdateTache = async (updatedTask) => {
        try {
            await updateTache(updatedTask).unwrap();
            onHandleNormalSuccess('Tâche mise à jour avec succès');
            await refetchData();
            setOpenDialog(false);
        } catch (error) {
            onHandleNormalError('Erreur lors de la mise à jour de la tâche');
        }
    };

    // Function to export all data to PDF
    const exportAllToPDF = () => {
        const doc = new jsPDF();
        const startX = 20;
        const titleY = 20;
        const subtitleY = 30;
        const tableStartY = 80;
    
        // Add title
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Détails de la Tâche", startX, titleY);
    
        // Add subtitled sections with borders
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        doc.text("En-tête de la Tâche", startX, subtitleY);
    
        doc.setFontSize(10);
        const infoYStart = subtitleY + 10;
        doc.autoTable({
            startY: infoYStart,
            margin: { top: 10, left: startX, right: startX },
            head: [['Libellé Journée', 'Date d\'Opération', 'Remarques', 'Utilisateur']],
            body: [
                [entete.LibelleJournee, dayjs(entete.DateOperation).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), entete.Remarques, entete.UtilisateurNom]
            ],
            theme: 'grid',
            styles: { fontSize: 10 },
            columnStyles: {
                0: { fillColor: [240, 240, 240] }
            },
        });
    
        // Add tasks table
        doc.setFontSize(12);
        doc.text("Détails des Tâches", startX, infoYStart + 30);
        doc.autoTable({
            startY: infoYStart + 35,
            head: [['ID Tâche', 'Heure Début', 'Heure Fin', 'Temps Différence', 'Coefficient', 'Prix Calculé', 'Remarques']],
            body: taches.map(row => [
                row.LibelleTache,
                dayjs(row.HDebut).format('HH:mm:ss'),
                dayjs(row.HFin).format('HH:mm:ss'),
                row.TempsDiff,
                row.TacheCoefficient,
                row.PrixCalc.toLocaleString(),
                row.DetailRemarques
            ]),
            margin: { left: startX, right: startX },
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 9 },
            styles: { fontSize: 9, cellPadding: 3 },
            pageBreak: 'avoid',
        });
    
        // Add footer
        const finalY = doc.autoTable.previous.finalY + 10;
        doc.text("____________________________", startX, finalY);
        doc.text("Signature", startX, finalY + 10);
        doc.text("___________", 160, finalY);
        doc.text("Date", 160, finalY + 10);
    
        doc.save(`taches_details.pdf`);
    };
    
    // Function to export all data to HTML
    const exportAllToHTML = () => {
        const htmlContent = `
            <html>
                <head>
                    <title>Liste des Tâches</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1 { font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                        h2 { font-size: 24px; font-weight: bold; margin-top: 30px; }
                        p { font-size: 14px; margin: 5px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .footer { margin-top: 30px; }
                        .signature { margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Détails de la Tâche</h1>
                    
                    <h2>En-tête des Tâches</h2>
                    <p><strong>Libellé Journée:</strong> ${entete.LibelleJournee}</p>
                    <p><strong>Date d'Opération:</strong> ${dayjs(entete.DateOperation).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p><strong>Remarques:</strong> ${entete.Remarques}</p>
                    <p><strong>Utilisateur:</strong> ${entete.UtilisateurNom}</p>
                    
                    <h2>Détails des Tâches</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tâche</th>
                                <th>Heure Début</th>
                                <th>Heure Fin</th>
                                <th>Temps Différence</th>
                                <th>Coefficient</th>
                                <th>Prix Calculé(DH)</th>
                                <th>Remarques</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${taches.map(row => `
                                <tr>
                                    <td>${row.EnteteTacheID}</td>
                                    <td>${row.LibelleTache}</td>
                                    <td>${dayjs(row.HDebut).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>${dayjs(row.HFin).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>${row.TempsDiff} min</td>
                                    <td>${row.TacheCoefficient}</td>
                                    <td>${row.PrixCalc.toLocaleString()}</td>
                                    <td>${row.DetailRemarques}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>____________________________</p>
                        <div class="signature">
                            <p>Signature</p>
                            <br>
                            <br>
                            <br>
                            <p>Date</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        saveAs(blob, 'taches_details.html');
    };
    

    // Function to export all data to CSV
    const exportAllToCSV = () => {
        const fields = ['LibelleTache', 'HDebut', 'HFin', 'TempsDiff', 'TacheCoefficient', 'PrixCalc', 'DetailRemarques'];
        const opts = { fields, delimiter: ';' };
        
        try {
            // Assuming `taches` is a globally available variable or imported
            const csv = parse(taches, opts);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'taches_details.csv');
        } catch (err) {
            console.error('Error exporting to CSV:', err);
        }
    };
    


    const columns = [
        {
            field: 'Tache',
            headerName: 'Tâche',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.LibelleTache}>{row.LibelleTache}</CustomTooltip>;
            }
        },
        {
            field: 'HeureDebut',
            headerName: 'Heure Début',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HDebut).subtract(2, 'hour').format('YYYY-MM-DD HH:mm');
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        {
            field: 'HeureFin',
            headerName: 'Heure Fin',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HFin).subtract(2, 'hour').format('YYYY-MM-DD HH:mm');
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        {
            field: 'TempsDifference',
            headerName: 'Temps Différence (minutes)',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return (
                    <CustomTooltip title={`${row.TempsDiff} min`}>
                        {`${row.TempsDiff} min`}
                    </CustomTooltip>
                );
            }
        },
        {
            field: 'Coefficient',
            headerName: 'Coefficient',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.TacheCoefficient}>{row.TacheCoefficient}</CustomTooltip>;
            }
        },
        {
            field: 'PrixCalcule',
            headerName: 'Prix Calculé',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.PrixCalc}>{row.PrixCalc}</CustomTooltip>;
            }
        },
        {
            field: 'Remarques',
            headerName: 'Remarques',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.DetailRemarques}>{row.DetailRemarques}</CustomTooltip>;
            }
        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: (params) => (
                <>
                    <Tooltip title="Editer">
                        <IconButton
                            color="primary"
                            onClick={() => handleEditTacheClick(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteTacheClick(params.row.DetailsTacheID)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <>
            <Box sx={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={taches}
                    columns={columns}
                    pageSize={5}
                    loading={isLoading}
                    rowsPerPageOptions={[5]}

                    localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                    sx={{
                        height: 400,
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                        }
                    }}
                />
                <Grid container spacing={2} mt={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={exportAllToPDF}
                            sx={{ backgroundColor: theme.palette.blue.first, color: theme.palette.white.first, fontWeight: 'bold' }}
                        >
                            Exporter tout en PDF
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={exportAllToHTML}
                            sx={{ backgroundColor: theme.palette.blue.first, color: theme.palette.white.first, fontWeight: 'bold' }}
                        >
                            Exporter tout en HTML
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={exportAllToCSV}
                            sx={{ backgroundColor: theme.palette.blue.first, color: theme.palette.white.first, fontWeight: 'bold' }}
                        >
                            Exporter tout en CSV
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <AssignTaskDialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    refetchData();
                }}
                tache={selectedTache}
            />

            <SnackbarComponent
                open={snackbarState.open}
                handleClose={handleCloseSnackbar}
                severity={snackbarState.severity}
                message={snackbarState.message}
            />
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                aria-labelledby="confirm-delete-dialog"
                aria-describedby="confirm-delete-dialog-description"
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de supprimer cette tâche ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} sx={{
                        backgroundColor: theme.palette.blue.first,
                        color: theme.palette.white.first,
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: theme.palette.blue.first,
                            color: theme.palette.white.first
                        }
                    }}>
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} color="secondary"
                        sx={{
                            backgroundColor: theme.palette.red.first,
                            color: theme.palette.white.first,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: theme.palette.red.first,
                                color: theme.palette.white.first
                            }
                        }}>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TachesParEntete;
