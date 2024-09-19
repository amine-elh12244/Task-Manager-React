import { apiSlice } from "../app/api/apiSlice";

export const utilisateurApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllUtilisateurs: builder.query({
      query: () => ({
        url: '/utilisateurs',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((utilisateur) => ({ ...utilisateur, id: utilisateur.UtilisateurID }));
      },
      providesTags: ['Utilisateurs'],
    }),
    createUtilisateur: builder.mutation({
      query: (utilisateur) => ({
        url: '/utilisateurs',
        method: 'POST',
        body: utilisateur,
      }),
      invalidatesTags: ['Utilisateurs'],
    }),
    updateUtilisateur: builder.mutation({
      query: (utilisateur) => ({
        url: `/utilisateurs/${utilisateur.id}`,
        method: 'PUT',
        body: utilisateur,
      }),
      invalidatesTags: ['Utilisateurs'],
    }),
    deleteUtilisateur: builder.mutation({
      query: (id) => ({
        url: `/utilisateurs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Utilisateurs'],
    }),
  }),
});

export const {
  useGetAllUtilisateursQuery,
  useCreateUtilisateurMutation,
  useUpdateUtilisateurMutation,
  useDeleteUtilisateurMutation,
} = utilisateurApiSlice;
