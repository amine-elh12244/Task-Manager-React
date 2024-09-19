import { apiSlice } from "../app/api/apiSlice";

export const crudApiSlice = apiSlice.injectEndpoints({        

    endpoints: builder => ({
        getAllUsers: builder.query({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            transformResponse: (response) => {
                return response.map((user) => ({ ...user, id: user.UserId }));
            },
            providesTags: ['users'],

        }),
        create: builder.mutation({
            query: data => ({
                url: '/register',
                method: 'POST',
                body: { ...data }
            }),
            invalidatesTags: ['users'],

        }),
        update: builder.mutation({
            query:   data  => ({
                url: `/users`,
                method: 'PUT',
                body: { ...data  }
            }),
            invalidatesTags: ['users'],
        }),
        delete: builder.mutation({
            query: id => ({
                url: `/users`,
                method: 'DELETE',
                body: {id }

            }),
            invalidatesTags: ['users'],
        }),
        deactivate: builder.mutation({
            query: ({ id, isActive }) => ({
              url: `/users/deactivate`,
              method: 'PUT',
              body: { isActive ,id }
            }),
            invalidatesTags: ['users'],
          }),
          getRoles: builder.query({
            query: () => ({
              url: '/users/roles',
              method: 'GET',
            }),
            providesTags: ['roles'],
          }),
    })
});

export const {
    useGetAllUsersQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
    useDeactivateMutation,
    useGetRolesQuery
} = crudApiSlice;
