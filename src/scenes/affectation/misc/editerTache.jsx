import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import {
  useCreateDetailsTacheMutation,
  useUpdateDetailTacheMutation,
  useDeleteEnteteTacheMutation,
  useGetAllTachesQuery
} from '../../../features/tacheApiSlice';
import SnackbarComponent from 'components/misc/snackBar';

const EditerTache = ({ open, onClose, tache, variant }) => {
  const theme = useTheme();
  const { data: taches = [] } = useGetAllTachesQuery();
  const [deleteEnteteTache] = useDeleteEnteteTacheMutation();
  const mutationHook =
    variant === 'ajouter' ? useCreateDetailsTacheMutation : useUpdateDetailTacheMutation;
  const [mutateTache, { isLoading }] = mutationHook();

  const [taskFields, setTaskFields] = useState({
    EnteteTacheID: tache && tache.EnteteTacheID ? tache.EnteteTacheID : '',
    tache: '',
    heureDebut: '',
    heureFin: '',
    tempsDifference: '',
    coefficient: '',
    prixCalcule: '',
    remarques: '',
    id: '',
    baseDate: ''
  });

  const [timeError, setTimeError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const baseDate2 = tache && tache.DateOperation ? new Date(tache.DateOperation).toISOString().substr(0, 10) : '';

  useEffect(() => {
    if (tache) {
      const baseDate = baseDate2;
      setTaskFields(prevFields => ({
        ...prevFields,
        tache: tache.LibelleTache || '',
        heureDebut: tache.HDebut ? new Date(tache.HDebut).toISOString().substr(11, 5) : '',
        heureFin: tache.HFin ? new Date(tache.HFin).toISOString().substr(11, 5) : '',
        tempsDifference: tache.TempsDiff || '',
        coefficient: tache.TacheCoefficient || '',
        prixCalcule: tache.PrixCalc || '',
        remarques: tache.DetailRemarques || '',
        id: tache.DetailsTacheID || '',
        baseDate,
        EnteteTacheID: tache?.EnteteTacheID || '',
      }));
    }
  }, [tache, baseDate2]);

  const calculateMinutesDifference = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(baseDate2 + `T${startTime}:00Z`);
    const end = new Date(baseDate2 + `T${endTime}:00Z`);
    const diffMs = end - start;
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const validateTimes = (startTime, endTime) => {
    if (!startTime || !endTime) return true;
    const start = new Date(baseDate2 + `T${startTime}:00Z`);
    const end = new Date(baseDate2 + `T${endTime}:00Z`);
    if (end < start) {
      setTimeError('Heure Fin doit être plus tard que Heure Début.');
      return false;
    }
    setTimeError('');
    return true;
  };

  const handleTaskChange = e => {
    const { name, value } = e.target;
    setTaskFields(prevFields => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleTaskSelectChange = e => {
    const value = e.target.value;
    const selectedTask = taches.find(t => t.LibelleTache === value);

    if (selectedTask) {
      setTaskFields(prevFields => {
        const updatedFields = {
          ...prevFields,
          tache: value,
          coefficient: selectedTask.Coefficient || '',
          id: selectedTask.TacheID || ''
        };

        if (prevFields.heureDebut && prevFields.heureFin) {
          const diff = calculateMinutesDifference(prevFields.heureDebut, prevFields.heureFin);
          const prix = (diff * updatedFields.coefficient).toFixed(2);
          updatedFields.tempsDifference = diff;
          updatedFields.prixCalcule = prix;
        }

        return updatedFields;
      });
    }
  };

  const handleDelete = id => {
    deleteEnteteTache(id)
      .unwrap()
      .then(() => {
        console.log("Entête Tâche deleted successfully");
      })
      .catch(error => {
        console.error("Failed to delete Entête Tâche: ", error);
      });
  };

  const handleHeureFinBlur = () => {
    if (!validateTimes(taskFields.heureDebut, taskFields.heureFin)) {
      // Handle validation error if needed
    }
  };

  const handleSubmit = () => {
    const selectedTask = taches.find(t => t.LibelleTache === taskFields.tache);

    if (!selectedTask) {
      console.error("Selected task not found in taches array");
      return;
    }

    const updatedTask = {
      DetailsTacheID: taskFields.id,
      EnteteTacheID: taskFields.EnteteTacheID,
      TacheID: selectedTask.TacheID,
      HDebut: `${baseDate2}T${taskFields.heureDebut}:00.000Z`,
      HFin: `${baseDate2}T${taskFields.heureFin}:00.000Z`,
      TempsDiff: taskFields.tempsDifference,
      DetailCoefficient: taskFields.coefficient,
      PrixCalc: taskFields.prixCalcule,
      DetailRemarques: taskFields.remarques,
    };

    mutateTache(updatedTask).then(() => {
      setSnackbarOpen(true); // Open Snackbar on successful update
      onClose(); // Close dialog after successful mutation
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (taskFields.heureDebut && taskFields.heureFin && taskFields.coefficient) {
      if (validateTimes(taskFields.heureDebut, taskFields.heureFin)) {
        const diff = calculateMinutesDifference(taskFields.heureDebut, taskFields.heureFin);
        const prix = (diff * taskFields.coefficient).toFixed(2);
        setTaskFields(prevFields => ({
          ...prevFields,
          tempsDifference: diff,
          prixCalcule: prix,
        }));
      }
    }
  }, [taskFields.heureDebut, taskFields.heureFin, taskFields.coefficient]);

  const title = variant === 'ajouter' ? "Assigner Une Tâche" : "Modifier la Tâche";

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="tache-label">Tâche</InputLabel>
                <Select
                  labelId="tache-label"
                  id="tache-select"
                  value={taskFields.tache}
                  onChange={handleTaskSelectChange}
                  label="Tâche"
                >
                  {taches.length > 0 ? (
                    taches.map(t => (
                      <MenuItem key={t.id} value={t.LibelleTache}>
                        {t.LibelleTache}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>Aucune tâche disponible</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="heureDebut"
                label="Heure Début"
                type="time"
                value={taskFields.heureDebut}
                onChange={handleTaskChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="heureFin"
                label="Heure Fin"
                type="time"
                value={taskFields.heureFin}
                onChange={handleTaskChange}
                onBlur={handleHeureFinBlur}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="tempsDifference"
                label="Durée"
                value={taskFields.tempsDifference !== undefined ? `${taskFields.tempsDifference} min` : '-'}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="coefficient"
                label="Coefficient"
                value={taskFields.coefficient}
                onChange={handleTaskChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="prixCalcule"
                label="Prix Calculé"
                value={taskFields.prixCalcule}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="remarques"
                label="Remarques"
                value={taskFields.remarques}
                onChange={handleTaskChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            {timeError && (
              <Typography color="error" mt={2}>
                {timeError}
              </Typography>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button
            onClick={onClose}
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
        </DialogActions>
      </Dialog>

      {/* Snackbar for edit success */}
      <SnackbarComponent
        open={snackbarOpen}
        autoHideDuration={6000}
        handleClose={handleCloseSnackbar}
        message="Édition de tâche réussie!"

      />
    </>
  );
};

export default EditerTache;
