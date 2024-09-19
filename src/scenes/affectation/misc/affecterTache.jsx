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
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetAllTachesWithDetailsByIdQuery, useUpdateTacheMutation, useDeleteDetailsTacheMutation } from '../../../features/tacheApiSlice';
import EditerTache from './editerTache';
import { CustomTooltip } from "../../../components/misc/customTooltip.tsx";
import dayjs from "dayjs";
import SnackbarComponent from "../../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";

const AffecterTache = ({ entete,enteteId ,LibelleJournee}) => {
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
    const {
        data: taches = [],
        isLoading,
        error,
        refetch
    } = useGetAllTachesWithDetailsByIdQuery(enteteId, {
        skip: !enteteId
    });
    useEffect(()=>{
        console.log(LibelleJournee)
    },[LibelleJournee])
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
        setSelectedTache(id);
        setConfirmDeleteOpen(true);
    };

    // Function to confirm delete action
    const handleDelete = async () => {
        try {
            await deleteTache(selectedTache).unwrap();
            onHandleNormalSuccess('Tâche supprimée avec succès');
            await refetchData();
            setConfirmDeleteOpen(false); // Close confirmation dialog after delete
        } catch (error) {
            onHandleNormalError('Erreur lors de la suppression de la tâche');
        }
    };

     // Handle opening the AssignTaskDialog for adding a new task
     const handleAssignTaskClick = () => {
            console.log("clickeddezfaedfa")
        setOpenDialog(true);
        
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
            width: 145,
            align: 'center',
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HDebut).subtract(2, 'hour').format('DD-MM-YYYY à HH:mm');
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        {
            field: 'HeureFin',
            headerName: 'Heure Fin',
            width: 145,
            align: 'center',
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HFin).subtract(2, 'hour').format('DD-MM-YYYY à HH:mm');
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
            width: 80,
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
            <Box sx={{  width: '100%' }}>
                <DataGrid
                    rows={taches}
                    columns={columns}
                    loading={isLoading}
                    pageSize={taches?.length}
                    autoHeight 
                    hideFooter
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterLogicOperator: GridLogicOperator.Or,
                            },
                        },
                    }}
                    localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                        }
                      
                    }}
                />
                {enteteId &&
                 <Button
                 variant="contained"
                 color="primary"
                 onClick={handleAssignTaskClick}
                 
                 sx={{
                    backgroundColor: theme.palette.blue.first,
                    color: theme.palette.white.first,
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: theme.palette.blue.first,
                        color: theme.palette.white.first
                    },marginTop:2
                }}
             >
                 Assigner une Nouvelle Tâche Pour La Journée {LibelleJournee}
             </Button>
                }
                
            </Box>
            <EditerTache
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    refetchData();
                }}
                enteteId={enteteId}
                variant={"ajouter"}
                tache={entete}
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

export default AffecterTache;
