import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme, Tooltip } from '@mui/material';
import { AccountCircle, Group, Assignment, Folder, Description } from '@mui/icons-material';
import { useGetDashboardDataQuery, useGetAverageTaskTimeQuery, useGetAverageTasksPerUserQuery, useGetAverageTaskCostQuery } from '../../features/dashboardApiSlice';
import PieForDay from './misc/pieChartForDay';
import TaskPurcentagesPie from './misc/taskPurcentagesPie';
import TasksPerWeekLineChart from './misc/tasksPerWeekLineChart';
import TasksPerMonthLineChart from './misc/taskPerMonthLineChart';

const TableauDeBord = () => {
  const theme = useTheme();

  const { data, error, isLoading } = useGetDashboardDataQuery();
  const { data: averageTaskTime } = useGetAverageTaskTimeQuery();
  const { data: averageTasksPerUser } = useGetAverageTasksPerUserQuery();
  const { data: averageTaskCost } = useGetAverageTaskCostQuery();

  const [usersCount, setUsersCount] = useState(0);
  const [familleUsersCount, setFamilleUsersCount] = useState(0);
  const [tachesCount, setTachesCount] = useState(0);
  const [entetTachesCount, setEntetTachesCount] = useState(0);
  const [detTachesCount, setDetTachesCount] = useState(0);

  useEffect(() => {
    if (data) {
      setUsersCount(data.UsersCount);
      setFamilleUsersCount(data.FamilleUsersCount);
      setTachesCount(data.TachesCount);
      setEntetTachesCount(data.EntetesTachesCount);
      setDetTachesCount(data.DetailsTachesCount);
    }
  }, [data]);

  const coolColors = [
    '#007bff',   // Blue
    '#28a745',   // Green
    '#ffc107',   // Yellow
    '#dc3545',   // Red
    '#673ab7',   // Purple
    '#17a2b8',   // Cyan
    '#fd7e14',   // Orange
    '#6610f2'    // Indigo
  ];

  return (
    <Grid container spacing={3} p={5}>
      {/* Card for Utilisateurs */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ minWidth: '160px', maxHeight: '115px', bgcolor: coolColors[0], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Utilisateurs
              </Typography>
              <AccountCircle fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ minWidth: '160px', fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {usersCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Utilisateurs de famille */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[1], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Utilisateurs de famille
              </Typography>
              <Group fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {familleUsersCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[2], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Tâches
              </Typography>
              <Assignment fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {tachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Entêtes de tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[3], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Entêtes de tâches
              </Typography>
              <Folder fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {entetTachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Détails de tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[4], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Détails de tâches
              </Typography>
              <Description fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {detTachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Average Tasks per User */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[5], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5} >
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Tâches moyennes par utilisateur
              </Typography>
              <Group fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography mb={1.5} variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {averageTasksPerUser ? averageTasksPerUser : 'Loading...'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Average Task Time */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Tooltip
          title={
            <Box sx={{ maxWidth: 300 }}>
              <Typography variant="body1">Min: {averageTaskTime && averageTaskTime.MinTaskTime} min</Typography>
              <Typography variant="body1">Max: {averageTaskTime && averageTaskTime.MaxTaskTime} min</Typography>
            </Box>
          }
          placement="top"
        >
          <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[6], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                  Temps moyen des tâches
                </Typography>
                <Assignment fontSize="large" sx={{ color: theme.palette.white.first }} />
              </Box>
              <Typography mb={1.5} variant="h1" component="h1" sx={{ minWidth: '160px', fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
                {averageTaskTime ? `${averageTaskTime.AverageTaskTime} min` : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      </Grid>


      {/* Card for Average Task Cost */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Tooltip
          title={
            <Box sx={{ maxWidth: 300 }}>
              <Typography variant="body1">Min: {averageTaskCost && averageTaskCost.MinTaskCost} DH</Typography>
              <Typography variant="body1">Max: {averageTaskCost && averageTaskCost.MaxTaskCost} DH</Typography>
            </Box>
          }
          placement="top"
        >
          <Card sx={{ maxHeight: '115px', minWidth: '160px', bgcolor: coolColors[7], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                  Coût moyen des tâches
                </Typography>
                <Assignment fontSize="large" sx={{ color: theme.palette.white.first }} />
              </Box>
              <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
                {averageTaskCost ? `${averageTaskCost.AverageTaskCost} DH` : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      </Grid>
      {/* charts*/}
      <Grid item xs={12} md={12} lg={12}>
      <Card sx={{ minHeight: '100%', borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
          <Typography variant="h2" fontWeight={800} component="h2" sx={{ mb: 2, color: theme.palette.blue.first }}>
            Métriques
          </Typography>

          <Grid container spacing={2} >
            {/* Task Percentages Pie */}
              <TaskPurcentagesPie />
            {/* Pie For Day */}
              <PieForDay />
          </Grid>
          <Grid container spacing={2} mt={3}>
            {/* Task Per week per month */}
              <TasksPerWeekLineChart />
              <TasksPerMonthLineChart/>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
     
    </Grid>


  );
};

export default TableauDeBord;
