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
import { useGetTasksPerMonthForYearQuery } from '../../../features/dashboardApiSlice';

const TasksPerMonthLineChart = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = React.useState(currentYear);

    const { data, error, isLoading, refetch } = useGetTasksPerMonthForYearQuery(selectedYear);

    useEffect(() => {
        if (error) {
            console.error('Error fetching tasks per month data:', error);
        }
    }, [error]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        refetch();
    }, [selectedYear, refetch]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching tasks per month data</p>;
    }

    // Map months to French names
    const frenchMonths = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const formattedData = [
        {
            id: 'tasksPerMonth',
            color: 'hsl(200, 70%, 50%)',
            data: data.map((item) => ({
                x: frenchMonths[item.MonthNumber - 1], // Adjust for zero-indexed array
                y: item.TasksCompleted,
            })),
        },
    ];

    const years = [];
    for (let year = currentYear; year <= currentYear + 10; year++) {
        years.push(year);
    }

    return (
        <Grid item rowSpacing={1} xs={12} sm={12} md={6} lg={6} xl={6} sx={{ height: "380px", borderRadius: '15px', display: "flex" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                    p="20px"
                    height="100%"
                    style={{ borderRadius: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Nombre des taches par mois par an
                    </Typography>
                    <hr style={{ border: `1px solid `, width: '100%' }} />
                    <FormControl sx={{ minWidth: 120, marginTop: '10px' }}>
                        <InputLabel id="year-select-label">Année</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={selectedYear}
                            label="Année"
                            onChange={handleYearChange}
                        >
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
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
                            legend: 'Mois',
                            legendOffset: 36,
                            legendPosition: 'middle',
                            format: value => frenchMonths.indexOf(value) + 1 // Convert month name to French
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Tâches complétées',
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

export default TasksPerMonthLineChart;
