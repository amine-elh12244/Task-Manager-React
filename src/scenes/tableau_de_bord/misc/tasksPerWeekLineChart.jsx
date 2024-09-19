import React, { useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import {
    Grid,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useGetTasksPerWeekForMonthQuery } from '../../../features/dashboardApiSlice';


const TasksPerWeekLineChart = () => {
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);

    const { data, error, isLoading, refetch } = useGetTasksPerWeekForMonthQuery(selectedMonth);

    useEffect(() => {
        if (error) {
            console.error('Error fetching tasks per week data:', error);
        }
    }, [error]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    useEffect(() => {
        refetch();
    }, [selectedMonth, refetch]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching tasks per week data</p>;
    }

    const formattedData = [
        {
            id: 'tasksPerWeek',
            color: 'hsl(200, 70%, 50%)',
            data: data.map((item) => ({
                x: `Week ${item.WeekNumber}`,
                y: item.TasksCompleted,
            })),
        },
    ];

    const monthsInFrench = [
        { value: 1, label: 'Janvier' },
        { value: 2, label: 'Février' },
        { value: 3, label: 'Mars' },
        { value: 4, label: 'Avril' },
        { value: 5, label: 'Mai' },
        { value: 6, label: 'Juin' },
        { value: 7, label: 'Juillet' },
        { value: 8, label: 'Août' },
        { value: 9, label: 'Septembre' },
        { value: 10, label: 'Octobre' },
        { value: 11, label: 'Novembre' },
        { value: 12, label: 'Décembre' },
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
                        Nombre des taches par semaine par mois
                    </Typography>
                    <hr style={{ border: `1px solid `, width: '100%' }} />
                    <FormControl sx={{ minWidth: 120, marginTop: '10px' }}>
                        <InputLabel id="month-select-label">Mois</InputLabel>
                        <Select
                            labelId="month-select-label"
                            id="month-select"
                            value={selectedMonth}
                            label="Mois"
                            onChange={handleMonthChange}
                        >
                            {monthsInFrench.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <ResponsiveLine
                        data={formattedData}
                        margin={{ top: 10, right: 30, bottom: 135, left: 30 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Semaine',
                            legendOffset: 36,
                            legendPosition: 'middle',
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Tasks Completed',
                            legendOffset: -40,
                            legendPosition: 'middle',
                        }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="y"
                        pointLabelYOffset={-12}
                        useMesh={true}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default TasksPerWeekLineChart;
