import { apiSlice } from "../app/api/apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: '/dashboard/overall',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getAverageTaskTime: builder.query({
      query: () => ({
        url: '/dashboard/average-task-time',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getAverageTasksPerUser: builder.query({
      query: () => ({
        url: '/dashboard/average-tasks-per-user',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getAverageTaskCost: builder.query({
      query: () => ({
        url: '/dashboard/average-task-cost',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getTasksStatusForDay: builder.query({
      query: () => ({
        url: '/dashboard/tasks-status-for-day',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getTaskPercentages: builder.query({
      query: () => ({
        url: '/dashboard/task-percentages',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    getTasksPerWeekForMonth: builder.query({
        query: (month) => ({
          url: `/dashboard/tasks-per-week?month=${month}`, 
          method: 'GET',
        }),
        providesTags: ['dashboard'],
      }),
      getTasksPerMonthForYear: builder.query({
        query: (year) => ({
          url: `/dashboard/tasks-per-month?year=${year}`,
          method: 'GET',
        }),
        providesTags: ['dashboard'],
      }),
      
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetAverageTaskTimeQuery,
  useGetAverageTasksPerUserQuery,
  useGetAverageTaskCostQuery,
  useGetTasksStatusForDayQuery,
  useGetTaskPercentagesQuery,
  useGetTasksPerWeekForMonthQuery,
  useGetTasksPerMonthForYearQuery,
} = dashboardApiSlice;
