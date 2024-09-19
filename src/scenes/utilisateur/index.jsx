import { useTheme } from "@mui/material/styles";
import { Box, Button, Grid, IconButton, Paper, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useEffect, useMemo, useState, useRef } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import SnackbarComponent from "../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import { useGetAllUtilisateursQuery, useUpdateUtilisateurMutation, useCreateUtilisateurMutation, useDeleteUtilisateurMutation } from '../../features/utilisateurApiSlice';
import { useGetAllFamiliesQuery } from '../../features/familyApiSlice';
import React from 'react';
import { CustomTooltip } from "../../components/misc/customTooltip.tsx";
import jsPDF from 'jspdf';
import { parse } from 'json2csv';
import { saveAs } from 'file-saver';


dayjs.extend(utc);

const exportToPDF = (row) => {
  const doc = new jsPDF();
  doc.text("Utilisateur", 20, 20);
  doc.text("Détails de l'utilisateur", 20, 30);
  doc.autoTable({
    startY: 40,
    head: [['Nom', 'Age', 'Email', 'Famille']],
    body: [[row.Nom, row.Age, row.Email, row.LibelleFamille]]
  });
  doc.text("Signature", 20, doc.lastAutoTable.finalY + 30);
  doc.text("Date", 150, doc.lastAutoTable.finalY + 30);
  doc.save(`${row.Nom}_details.pdf`);
};



const exportAllToPDF = (rows) => {
  const doc = new jsPDF();
  doc.text("Liste des Utilisateurs", 20, 20);
  doc.autoTable({
    startY: 30,
    head: [['Nom', 'Age', 'Email', 'Famille']],
    body: rows.map(row => [row.Nom, row.Age, row.Email, row.LibelleFamille])
  });
  doc.save(`utilisateurs_details.pdf`);
};

const exportAllToHTML = (rows) => {
  const htmlContent = `
    <html>
      <head>
        <title>Liste des Utilisateurs</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Liste des Utilisateurs</h2>
        <table>
          <tr><th>Nom</th><th>Age</th><th>Email</th><th>Famille</th></tr>
          ${rows.map(row => `
            <tr>
              <td>${row.Nom}</td>
              <td>${row.Age}</td>
              <td>${row.Email}</td>
              <td>${row.LibelleFamille}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `utilisateurs_details.html`;
  link.click();
};

const exportAllToCSV = (rows) => {
  // Ensure the data structure matches the fields
  const formattedRows = rows.map(row => ({
    Nom: row.Nom,
    Age: row.Age,
    Email: row.Email,
    Famille: row.LibelleFamille
  }));

  const fields = ['Nom', 'Age', 'Email', 'Famille'];
  const opts = { fields, delimiter: ';' };
  try {
    const csv = parse(formattedRows, opts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
    saveAs(blob, 'utilisateurs_details.csv');
  } catch (err) {
    console.error('Error exporting to CSV:', err);
  }
};



const UtilisateurManagement = () => {
  const theme = useTheme();
  const utilisateurRef = useRef(null);
  const initialUtilisateur = useMemo(() => ({ Nom: '', Age: '', Email: '', LibelleFamille: '' }), []);
  const [editUtilisateur, setEditUtilisateur] = useState(false);
  const [utilisateurData, setUtilisateurData] = useState(initialUtilisateur);
  const { data: familles = [] } = useGetAllFamiliesQuery();
  console.log("familles",familles)
  const [openModal, setOpenModal] = useState(false);
  const { data: utilisateurs = [], isLoading, error } = useGetAllUtilisateursQuery();
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

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

  const handleChangeNom = (e) => {
    setUtilisateurData({ ...utilisateurData, Nom: e.target.value });
  }

  const handleChangeAge = (e) => {
    setUtilisateurData({ ...utilisateurData, Age: e.target.value });
  }

  const handleChangeEmail = (e) => {
    setUtilisateurData({ ...utilisateurData, Email: e.target.value });
  }

  const handleChangeFamille = (e) => {
    setUtilisateurData({ ...utilisateurData, FamilleUtilisateurID: e.target.value });
  }

  const [createUtilisateur] = useCreateUtilisateurMutation();
  const [updateUtilisateur] = useUpdateUtilisateurMutation();
  const [deleteUtilisateur] = useDeleteUtilisateurMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Nom, Age, Email, FamilleUtilisateurID } = utilisateurData;
  
    // Simple regex for email validation
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    
    if (!Nom || !Age || !Email || !FamilleUtilisateurID) {
      onHandleNormalError("Tous les champs doivent être remplis.");
      return;
    }
    
    if (!emailPattern.test(Email)) {
      onHandleNormalError("Adresse email invalide.");
      return;
    }
    
    try {
      const res = await createUtilisateur(utilisateurData);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
        setUtilisateurData(initialUtilisateur);
        setOpenModal(false);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while creating the utilisateur");
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const { Nom, Age, Email, FamilleUtilisateurID } = utilisateurData;

    // Check if all required fields are filled
    if (!Nom || !Age || !Email || !FamilleUtilisateurID) {
      onHandleNormalError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const res = await updateUtilisateur(utilisateurData);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
        setUtilisateurData(initialUtilisateur);
        setEditUtilisateur(false);
        setOpenModal(false);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while updating the utilisateur");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteUtilisateur(id);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while deleting the utilisateur");
    }
  }

  useEffect(() => {
    if (!editUtilisateur) {
      setUtilisateurData(initialUtilisateur);
    }
  }, [editUtilisateur, initialUtilisateur]);

  const columns = [
    { field: 'Nom', headerName: 'Nom', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Nom}>{row.Nom}</CustomTooltip>) },
    { field: 'Age', headerName: 'Age', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Age}>{row.Age}</CustomTooltip>) },
    { field: 'Email', headerName: 'Email', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Email}>{row.Email}</CustomTooltip>) },
    { field: 'LibelleFamille', headerName: 'Famille', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.LibelleFamille}>{row.LibelleFamille}</CustomTooltip>) },
    {
      field: 'actions', headerName: 'Actions', flex: 1, sortable: false, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (
        <>
          <Tooltip title="Modifier l'utilisateur" placement="top">
            <IconButton onClick={() => {
              setEditUtilisateur(true);
              setUtilisateurData({ ...utilisateurData, ...row });
              setOpenModal(true);
              if (utilisateurRef.current) {
                utilisateurRef.current.focus();
              }
            }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimer l'utilisateur" placement="top">
            <IconButton onClick={() => exportToPDF(row)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer l'utilisateur" placement="top">
            <IconButton onClick={() => handleDelete(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUtilisateur(false);
    setUtilisateurData(initialUtilisateur);
  };



  return (
    <div theme={theme}>
      <Grid container spacing={0}>
      <Grid container spacing={2} ml={1.5} mt={3.8}>
      <Grid item>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{ 
            backgroundColor: theme.palette.blue.first, 
            color: theme.palette.white.first, 
            fontWeight: 'bold' 
          }}
        >
          Ajouter un utilisateur
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => exportAllToPDF(utilisateurs)}
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
          onClick={() => exportAllToHTML(utilisateurs)}
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
          onClick={() => exportAllToCSV(utilisateurs)}
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
                rows={utilisateurs}
                columns={columns}
                getRowId={(row) => row.id}
                loading={isLoading}
                slots={{ toolbar: QuickSearchToolbar }}
                initialState={{
                  filter: {
                    filterModel: {
                      items: [],
                      quickFilterLogicOperator: GridLogicOperator.Or,
                    },
                  },
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', } }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {snackbarState.open && (
        <SnackbarComponent
          open={snackbarState.open}
          severity={snackbarState.severity}
          message={snackbarState.message}
          handleClose={handleCloseSnackbar}
        />
      )}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{editUtilisateur ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</DialogTitle>
        <DialogContent>
          <Box component={"form"} onSubmit={editUtilisateur ? handleSubmitEdit : handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth required variant="outlined" id="Nom" name="Nom" label="Nom" value={utilisateurData.Nom || ''} onChange={handleChangeNom} inputRef={utilisateurRef} sx={{ marginTop: "14px" }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required variant="outlined" id="Age" name="Age" label="Age" value={utilisateurData.Age || ''} onChange={handleChangeAge} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="Email"
                  name="Email"
                  label="Email"
                  type="email"
                  value={utilisateurData.Email || ''}
                  onChange={handleChangeEmail}
                  inputProps={{
                    pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="FamilleUtilisateurID-label">Famille</InputLabel>
                  <Select
                    labelId="FamilleUtilisateurID-label"
                    id="FamilleUtilisateurID"
                    value={utilisateurData.FamilleUtilisateurID}
                    onChange={handleChangeFamille}
                    label="Famille"
                  >
                    {familles.map((famille) => (
                      <MenuItem key={famille.id} value={famille.id}>
                        {famille.LibelleFamille}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{
              backgroundColor: theme.palette.red.first,
              color: theme.palette.white.first,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.red.first,
              },
            }}
          >
            Annuler
          </Button>

          <Button
            onClick={editUtilisateur ? handleSubmitEdit : handleSubmit}
            sx={{
              backgroundColor: theme.palette.blue.first,
              color: theme.palette.white.first,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.blue.first,
              },
            }}
          >
            Sauvegarder
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UtilisateurManagement;

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
