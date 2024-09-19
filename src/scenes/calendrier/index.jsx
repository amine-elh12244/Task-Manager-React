import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useGetTachesForTheDayQuery, useGetAllTachesWithDetailsQuery } from '../../features/tacheApiSlice';
import EventCard from './misc/eventCard';
import TaskDetailsComponent from './misc/taskDetailsComponent';

const localizer = momentLocalizer(moment);

const Calendrier = () => {
  const [dateForQuery, setDateForQuery] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState([]);

  const { data: tasksForTheDay = [] } = useGetTachesForTheDayQuery(dateForQuery, { skip: !dateForQuery });
  const { data: tousTaches = [] } = useGetAllTachesWithDetailsQuery();
  const theme = useTheme();

  const parseTachesToEvents = useCallback((taches) => {
    return taches.map(tache => ({
      title: tache.LibelleTache || '',
      start: tache.HDebut ? new Date(tache.HDebut) : new Date(),
      end: tache.HFin ? new Date(tache.HFin) : new Date(),
      id: tache.TacheID.toString(),
      extendedProps: {
        LibelleJournee: tache.LibelleJournee || '',
        UtilisateurID: tache.UtilisateurID || '',
        UtilisateurNom: tache.UtilisateurNom || '',
        HDebut: tache.HDebut || '',
        TempsDiff: tache.TempsDiff || 0,
        Coefficient: tache.DetailCoefficient || 0,
        Remarques: tache.DetailRemarques || '',
        HFin: tache.HFin || '',
        calculatedPrice: tache.PrixCalc || 0
      }
    }));
  }, []);

  const calendarEvents = parseTachesToEvents(tousTaches);

  const handleSelectSlot = ({ start }) => {
    const selectedDate = moment(start).format('YYYY-MM-DD');
    setDateForQuery(selectedDate);
  };

  const handleSelectEvent = (event) => {
    const taskData = [{
      journeeLabel: event.extendedProps.LibelleJournee,
      utilisateur: event.extendedProps.UtilisateurNom,
      operationDate: event.extendedProps.HDebut,
      remarks: event.extendedProps.Remarques,
      taskDetails: event.extendedProps.LibelleJournee,
      task: event.title,
      startTime: event.extendedProps.HDebut,
      endTime: event.extendedProps.HFin,
      timeDifference: event.extendedProps.TempsDiff,
      coefficient: event.extendedProps.Coefficient,
      calculatedPrice: (event.extendedProps.TempsDiff * event.extendedProps.Coefficient).toFixed(2)
    }];
    setSelectedTaskData(taskData);
    setIsDialogOpen(true);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={3.5}>
          <Typography variant="h5" mb={2} ml={2}>Événements :</Typography>

            <Box backgroundColor={'white'} p="15px" borderRadius="4px" sx={{minWidth:"320px", overflowY: 'scroll',
            maxHeight: '500px',}}>
              <Box>
                {tasksForTheDay.map((event) => (
                  <EventCard key={event.TacheID} event={parseTachesToEvents([event])[0]} theme={theme} />
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8.5}>
            <Box ml="15px">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '80vh' }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                culture="fr"

                 messages={{
                  next: 'Suiv',
                  previous: 'Préc',
                  today: 'Aujourd\'hui',
                  month: 'Mois',
                  week: 'Semaine',
                  day: 'Jour',
                 
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <TaskDetailsComponent
        open={isDialogOpen}
        taskData={selectedTaskData}
        theme={theme}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
};

export default Calendrier;
