import React, { useState } from 'react';
import { Box, Grid, Typography, Divider, Dialog, DialogContent, IconButton, DialogActions, DialogTitle, Button } from '@mui/material';
import { Print as PrintIcon, Edit , Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';

const TaskDetailsComponent = ({ open, onClose, taskData, theme }) => {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    console.log(taskData)
    
    if (!taskData || taskData.length === 0) {
        return null;
    }

    const handlePrint = () => {
        const doc = new jsPDF();
        taskData.forEach((data, index) => {
            doc.text(`Libellé Journée: ${data.journeeLabel || '-'}`, 10, 10 + index * 60);
            doc.text(`Utilisateur: ${data.utilisateur || '-'}`, 10, 20 + index * 60);
            doc.text(`Date d'Opération: ${data.operationDate ? dayjs(data.operationDate).format('YYYY-MM-DD') : '-'}`, 10, 30 + index * 60);
            doc.text(`Remarques: ${data.remarks || '-'}`, 10, 40 + index * 60);
            doc.text(`Détails Tâche: ${data.taskDetails || '-'}`, 10, 50 + index * 60);
            doc.text(`Tâche: ${data.task || '-'}`, 10, 60 + index * 60);
            doc.text(`Heure Début: ${data.startTime || '-'}`, 10, 70 + index * 60);
            doc.text(`Heure Fin: ${data.endTime || '-'}`, 10, 80 + index * 60);
            doc.text(`Durée: ${data.timeDifference ? `${data.timeDifference} min` : '-'}`, 10, 90 + index * 60);
            doc.text(`Coefficient: ${data.coefficient || '-'}`, 10, 100 + index * 60);
            doc.text(`Prix Calculé: ${data.calculatedPrice ? `${data.calculatedPrice} DH` : '0 DH'}`, 10, 110 + index * 60);
            if (index < taskData.length - 1) {
                doc.addPage();
            }
        });
        doc.save('task-details.pdf');
    };

    const handleDelete = () => {
        // Placeholder for delete functionality
        console.log('Delete task');
        setConfirmDeleteOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    console.log('Dialog onClose triggered');
                    onClose();
                }}
                
                fullWidth
            >

                <DialogTitle sx={{ bgcolor: theme.palette.blue.first, color: theme.palette.white.first }}>
                    <Box display="flex" justifyContent="right" alignItems="center">
                        
                        <IconButton color="inherit" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    position: 'relative',
                    bgcolor: theme.palette.white.first,
                    p: 4,
                    maxHeight: "90%",
                    overflow: "auto",
                    boxShadow: 24
                }}>
                    <Box display={"flex"} flexDirection={"column"} gap={3} justifyContent={"center"} alignItems={"center"} >
                        {taskData.map((data, index) => (
                            <React.Fragment key={index}>
                                <Grid container spacing={3}>
                                    <Grid item mt={3} md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Libellé Journée
                                        </Typography>
                                    </Grid>
                                    <Grid item mt={3} md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.journeeLabel || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Utilisateur
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.utilisateur || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Date d'Opération
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.operationDate ? dayjs(data.operationDate).format('YYYY-MM-DD') : '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Remarques
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.remarks || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Détails Tâche
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.taskDetails || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Tâche
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.task || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Heure Début
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.startTime || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Heure Fin
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.endTime || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Durée
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.timeDifference ? `${data.timeDifference} min` : '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Coefficient
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.coefficient || '-'}
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%', backgroundColor: theme.palette.blue.first, height: '0.5px' }} />

                                <Grid container spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography variant='h5' color={theme.palette.blue.first} fontWeight={"bold"}>
                                            Prix Calculé
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} color={theme.palette.blue.first} textAlign={"right"}>
                                        {data.calculatedPrice ? `${data.calculatedPrice} DH` : '0 DH'}
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Confirmation Delete Dialog */}
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
                    <Button onClick={() => setConfirmDeleteOpen(false)}  sx={{
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

export default TaskDetailsComponent;
