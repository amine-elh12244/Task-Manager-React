
import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AssignTaskModal = ({ open, onClose, taches, taskFields, handleTaskChange, handleTaskSelectChange, handleTaskSubmit, timeError }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Attribuer une tâche</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Tâche</InputLabel>
              <Select
                value={taskFields.tache}
                name="tache"
                onChange={handleTaskSelectChange}
                label="Tâche"
              >
                {taches.map((tache) => (
                  <MenuItem key={tache.LibelleTache} value={tache.LibelleTache}>
                    {tache.LibelleTache}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Heure Début"
              type="time"
              name="heureDebut"
              value={taskFields.heureDebut}
              onChange={handleTaskChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Heure Fin"
              type="time"
              name="heureFin"
              value={taskFields.heureFin}
              onChange={handleTaskChange}
              onBlur={() => {
                if (!validateTimes(taskFields.heureDebut, taskFields.heureFin)) {
                  // Do nothing if validation fails
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              error={Boolean(timeError)}
              helperText={timeError}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Temps Différence (minutes)"
              type="number"
              name="tempsDifference"
              disabled
              value={taskFields.tempsDifference}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Coefficient"
              type="number"
              name="coefficient"
              disabled
              value={taskFields.coefficient}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Prix Calculé"
              type="number"
              name="prixCalcule"
              disabled
              value={taskFields.prixCalcule}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarques"
              name="remarques"
              multiline
              rows={2}
              value={taskFields.remarques}
              onChange={handleTaskChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.red.first,
            color: theme.palette.white.first,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: theme.palette.red.first,
              color: theme.palette.white.first,
            },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleTaskSubmit}
          sx={{
            backgroundColor: theme.palette.blue.first,
            color: theme.palette.white.first,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: theme.palette.blue.first,
              color: theme.palette.white.first,
            },
          }}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTaskModal;
