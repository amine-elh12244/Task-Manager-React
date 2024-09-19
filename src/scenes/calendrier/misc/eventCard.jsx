import React, { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';
import TaskDetailsComponent from './taskDetailsComponent';

const EventCard = ({ event, theme }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log("event",event)
    const formattedDebut = dayjs(event.extendedProps.HDebut).format('YYYY-MM-DD [à] HH:mm');

    const handleClick = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

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
        calculatedPrice: (event.extendedProps.TempsDiff * event.extendedProps.Coefficient).toFixed(2),
    }];

    return (
        <Box>
            <Box
                sx={{
                    cursor: "pointer",
                    marginBottom: "15px !important",
                    "&:last-child": {
                        marginBottom: "0"
                    }
                }}
                onClick={handleClick}
            >
                <Card
                    sx={{
                        backgroundColor: theme.palette.blue.second,
                        borderRadius: '10px',
                        boxShadow: 'none'
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.blue.second,
                                borderRadius: '15px',
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontSize:"20px",fontWeight: 950, color: theme.palette.blue.first }}>
                                {event.extendedProps.LibelleJournee}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.blue.first }}>
                                {event.title}
                            </Typography>
                            <Typography variant="body2">Utilisateur: {event.extendedProps.UtilisateurID}</Typography>
                            <Typography variant="body2">Début: {formattedDebut}</Typography>
                            <Typography variant="body2">Durée: {event.extendedProps.TempsDiff} minutes</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            
            <TaskDetailsComponent
                open={isDialogOpen}
                taskData={taskData}
                theme={theme}
                onClose={handleClose}
            />
        </Box>
    );
};

export default EventCard;
