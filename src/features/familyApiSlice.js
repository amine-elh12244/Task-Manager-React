import { apiSlice } from "../app/api/apiSlice";

export const familyApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllFamilies: builder.query({
      query: () => ({
        url: '/famille-utilisateurs',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response.map((family) => ({ ...family, id: family.FamilleUtilisateurID }));
      },
      providesTags: ['Families'],
    }),
    createFamily: builder.mutation({
      query: (family) => ({
        url: '/famille-utilisateurs',
        method: 'POST',
        body: family,
      }),
      invalidatesTags: ['Families'],
    }),
    updateFamily: builder.mutation({
      query: (family) => ({
        url: `/famille-utilisateurs/${family.id}`,
        method: 'PUT',
        body: family,
      }),
      invalidatesTags: ['Families'],
    }),
    deleteFamily: builder.mutation({
      query: (id) => ({
        url: `/famille-utilisateurs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Families'],
    }),
  }),
});

export const {
  useGetAllFamiliesQuery,
  useCreateFamilyMutation,
  useUpdateFamilyMutation,
  useDeleteFamilyMutation,  
} = familyApiSlice;
