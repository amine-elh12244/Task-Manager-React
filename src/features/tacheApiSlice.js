import { apiSlice } from "../app/api/apiSlice";

export const tacheApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllTachesWithDetails: builder.query({
      query: () => ({
        url: '/taches/total',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((tache) => ({ ...tache, id: tache.TacheID }));
      },
      providesTags: ['Taches'],
    }),

    getAllTaches: builder.query({
      query: () => ({
        url: '/taches',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((tache) => ({ ...tache, id: tache.TacheID }));
      },
      providesTags: ['Taches'],
    }),

    getTachesForTheDay: builder.query({
      query: (date) => ({
        url: `/taches/date/${date}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((tache) => ({ ...tache, id: tache.TacheID }));
      },
      providesTags: ['Taches'],
    }),

    getAllEntetesTaches: builder.query({
      query: () => ({
        url: '/entete-taches',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((entete) => ({ ...entete, id: entete.EnteteTacheID }));
      },
      providesTags: ['Entetes'],
    }),

    createEnteteTache: builder.mutation({
      query: (enteteTache) => ({
        url: '/entete-taches',
        method: 'POST',
        body: enteteTache,
      }),
      invalidatesTags: ['Entetes'],
    }),

    createTache: builder.mutation({
      query: (tache) => ({
        url: '/taches',
        method: 'POST',
        body: tache,
      }),
      invalidatesTags: ['Taches'],
    }),

    updateTache: builder.mutation({
      query: (tache) => ({
        url: `/taches/${tache.id}`,
        method: 'PUT',
        body: tache,
      }),
      invalidatesTags: ['Taches'],
    }),
    updateEnteteTache: builder.mutation({
      query: (tache) => ({
        url: `/entete-taches/${tache.id}`,
        method: 'PUT',
        body: tache,
      }),
      invalidatesTags: ['Taches'],
    }),

    deleteTache: builder.mutation({
      query: (id) => ({
        url: `/taches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Taches'],
    }),
    
    updateDetailTache: builder.mutation({
      query: (detailTache) => ({
        url: `/details-taches/${detailTache.DetailsTacheID}`, 
        method: 'PUT',
        body: detailTache,
      }),
      invalidatesTags: ['Taches'],
    }),

    deleteEnteteTache: builder.mutation({
      query: (id) => ({
        url: `/entete-taches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Entetes'],
    }),
    deleteDetailsTache: builder.mutation({
      query: (id) => ({
        url: `/details-taches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Details'],
    }),

    getAllTachesWithDetailsById: builder.query({
      query: (EnteteTacheID) => ({
        url: `/details-taches/${EnteteTacheID}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        console.log("Transformed Response:", response);
        return response.map((tache) => ({ ...tache, id: tache.DetailsTacheID }));
      },
    }),
    createDetailsTache: builder.mutation({
      query: (detailTache) => ({
        url: '/details-taches',
        method: 'POST',
        body: detailTache,
      }),
      invalidatesTags: ['Taches'],
    }),
    
  }),
});

export const {
  useGetAllTachesWithDetailsByIdQuery,
  useGetAllTachesQuery,
  useGetAllTachesWithDetailsQuery,
  useGetTachesForTheDayQuery,
  useGetAllEntetesTachesQuery,
  useCreateTacheMutation,
  useUpdateTacheMutation,
  useUpdateEnteteTacheMutation,
  useDeleteTacheMutation,
  useDeleteEnteteTacheMutation, 
  useDeleteDetailsTacheMutation,
  useCreateEnteteTacheMutation,
  useUpdateDetailTacheMutation, 
  useCreateDetailsTacheMutation,
} = tacheApiSlice;
