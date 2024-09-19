import { useTheme } from "@mui/material/styles";
import { Box, Button, Grid, IconButton, Paper, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useEffect, useMemo, useState, useRef } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import SnackbarComponent from "../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import { useGetAllFamiliesQuery, useUpdateFamilyMutation, useCreateFamilyMutation, useDeleteFamilyMutation } from '../../features/familyApiSlice';
import React from 'react';
import { CustomTooltip } from "../../components/misc/customTooltip.tsx";
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';

dayjs.extend(utc);

const exportToPDF = (row) => {
  const doc = new jsPDF();
  doc.text("Famille", 20, 20);
  doc.text("Détails de la famille utilisateur", 20, 30);
  doc.autoTable({
    startY: 40,
    head: [['Famille', 'Coefficient', 'Remarques']],
    body: [[row.LibelleFamille, row.Coefficient, row.Remarques]]
  });
  doc.text("Signature", 20, doc.lastAutoTable.finalY + 30);
  doc.text("Date", 150, doc.lastAutoTable.finalY + 30);
  doc.save(`${row.LibelleFamille}_details.pdf`);
};


const exportAllToPDF = (rows) => {
  const doc = new jsPDF();
  doc.text("Liste des Familles utilisateurs", 20, 20);
  doc.autoTable({
    startY: 30,
    head: [['Famille', 'Coefficient', 'Remarques']],
    body: rows.map(row => [row.LibelleFamille, row.Coefficient, row.Remarques])
  });
  doc.save(`utilisateurs_details.pdf`);
};

const exportAllToHTML = (rows) => {
  const htmlContent = `
    <html>
      <head>
        <title>Liste des Familles utilisateurs</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Liste des Familles utilisateurs</h2>
        <table>
          <tr><th>Famille</th><th>Coefficient</th><th>Remarques</th></tr>
          ${rows.map(row => `
            <tr>
              <td>${row.LibelleFamille}</td>
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
  link.download = `utilisateurs_details.html`;
  link.click();
};

const exportAllToCSV = (rows) => {
  // Ensure the data structure matches the fields
  const formattedRows = rows.map(row => ({
    LibelleFamille: row.LibelleFamille,
    Coefficient: row.Coefficient,
    Remarques: row.Remarques
  }));

  const fields = ['LibelleFamille', 'Coefficient', 'Remarques'];
  const opts = { fields, delimiter: ';' };

  try {
    const csv = parse(formattedRows, opts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'familles_details.csv');
  } catch (err) {
    console.error('Error exporting to CSV:', err);
  }
};


const FamilyManagement = () => {
  const theme = useTheme();
  const familyRef = useRef(null);
  const initialFamily = useMemo(() => ({ LibelleFamille: '', Coefficient: '', Remarques: '' }), []);
  const [editFamily, setEditFamily] = useState(false);
  const [familyData, setFamilyData] = useState(initialFamily);
  const [openModal, setOpenModal] = useState(false);
  const { data: families = [], isLoading, error } = useGetAllFamiliesQuery();
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

  const handleChangeLibelleFamille = (e) => {
    setFamilyData({ ...familyData, LibelleFamille: e.target.value });
  }

  const handleChangeCoefficient = (e) => {
    setFamilyData({ ...familyData, Coefficient: e.target.value });
  }

  const handleChangeRemarques = (e) => {
    setFamilyData({ ...familyData, Remarques: e.target.value });
  }

  const [createFamily] = useCreateFamilyMutation();
  const [updateFamily] = useUpdateFamilyMutation();
  const [deleteFamily] = useDeleteFamilyMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { LibelleFamille, Coefficient, Remarques } = familyData;
    if (!LibelleFamille || !Coefficient || !Remarques) {
      onHandleNormalError("Tous les champs doivent être remplis.");
      return;
    }
    try {
      const res = await createFamily(familyData);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
        setFamilyData(initialFamily);
        setOpenModal(false);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while creating the family");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const { LibelleFamille, Coefficient, Remarques } = familyData;
    if (!LibelleFamille || !Coefficient || !Remarques) {
      onHandleNormalError("Tous les champs doivent être remplis.");
      return;
    }
    try {
      const res = await updateFamily(familyData);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
        setFamilyData(initialFamily);
        setEditFamily(false);
        setOpenModal(false);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while updating the family");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteFamily(id);
      if (res?.data?.message) {
        onHandleNormalSuccess(res?.data?.message);
      } else {
        onHandleNormalError(res?.error?.data?.message);
      }
    } catch (error) {
      onHandleNormalError("An error occurred while deleting the family");
    }
  }

  useEffect(() => {
    if (!editFamily) {
      setFamilyData(initialFamily);
    }
  }, [editFamily, initialFamily]);

  const columns = [
    { field: 'LibelleFamille', headerName: 'Libellé Famille', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.LibelleFamille}>{row.LibelleFamille}</CustomTooltip>) },
    { field: 'Coefficient', headerName: 'Coefficient', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Coefficient}>{row.Coefficient}</CustomTooltip>) },
    { field: 'Remarques', headerName: 'Remarques', flex: 1, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (<CustomTooltip title={row.Remarques}>{row.Remarques}</CustomTooltip>) },
    {
      field: 'actions', headerName: 'Actions', width: 130, align: 'center', headerClassName: 'bold-weight', renderCell: ({ row }) => (
        <>
          <Tooltip title="Modifier la famille" placement="top">
            <IconButton onClick={() => {
              setEditFamily(true);
              setFamilyData({ ...familyData, ...row });
              setOpenModal(true);
              if (familyRef.current) {
                familyRef.current.focus();
              }
            }}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Imprimer la famille" placement="top">
            <IconButton onClick={() => exportToPDF(row)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer la famille" placement="top">
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
    setEditFamily(false);
    setFamilyData(initialFamily);
  };



  return (
    <div>
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
              Ajouter une famille
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => exportAllToPDF(families)}
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
              onClick={() => exportAllToHTML(families)}
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
              onClick={() => exportAllToCSV(families)}
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
                rows={families}
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
        <DialogTitle>{editFamily ? 'Modifier la famille' : 'Ajouter une famille'}</DialogTitle>
        <DialogContent>
          <Box component={"form"} onSubmit={editFamily ? handleSubmitEdit : handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth required variant="outlined" id="LibelleFamille" name="LibelleFamille" label="Libellé Famille" value={familyData.LibelleFamille || ''} onChange={handleChangeLibelleFamille} inputRef={familyRef} sx={{ marginTop: "14px" }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required variant="outlined" id="Coefficient" name="Coefficient" label="Coefficient" value={familyData.Coefficient || ''} onChange={handleChangeCoefficient} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required variant="outlined" id="Remarques" name="Remarques" label="Remarques" value={familyData.Remarques || ''} onChange={handleChangeRemarques} />
              </Grid>
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
                color: theme.palette.white.first
              }
            }}
          >
            Annuler
          </Button>

          <Button
            onClick={editFamily ? handleSubmitEdit : handleSubmit}
            sx={{
              backgroundColor: theme.palette.blue.first,
              color: theme.palette.white.first,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.blue.first,
                color: theme.palette.white.first
              }
            }}
          >
            Sauvegarder
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FamilyManagement;

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
