import React, { useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Grid, Box, Typography } from '@mui/material';
import { useGetTasksStatusForDayQuery } from '../../../features/dashboardApiSlice';

const PieForDay = () => {
    const { data, error, isLoading } = useGetTasksStatusForDayQuery();

    useEffect(() => {
        if (error) {
            console.error('Error fetching data:', error);
        }
    }, [error]);

    if (isLoading) {
        return <p>Loading...</p>; 
    }

    const dataSets = [
        { "id": 'Tâches passées', "label": 'Tâches passées', "value": data?.TasksPassed },
        { "id": 'Tâches en cours', "label": 'Tâches en cours', "value": data?.TasksInProgress },
        { "id": 'Tâches à démarrer', "label": 'Tâches à démarrer', "value": data?.TasksYetToStart }
    ];

    return (
        <Grid item rowSpacing={1} xs={12} sm={12} md={6} lg={6} xl={6} sx={{ height: "380px", borderRadius: '15px', display: "flex" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                    p="20px"
                    height="100%"
                    style={{ borderRadius: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Etat des taches
                    </Typography>
                    <hr style={{ border: `1px solid `, width: '100%' }} />
                    <ResponsivePie
                        data={dataSets}
                        margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        enableArcLinkLabels={false}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        defs={[
                            { id: 'dots', type: 'patternDots', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', size: 4, padding: 1, stagger: true },
                            { id: 'lines', type: 'patternLines', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', rotation: -45, lineWidth: 6, spacing: 10 }
                        ]}
                        fill={[
                            { match: { id: 'Tâches passées' }, id: 'dots' },
                            { match: { id: 'Tâches en cours' }, id: 'dots' },
                            { match: { id: 'Tâches à démarrer' }, id: 'dots' }
                        ]}
                       
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default PieForDay;
