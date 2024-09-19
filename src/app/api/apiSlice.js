import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {  logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:4004',
    credentials: 'include'
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 401) {
        api.dispatch(logOut());
        window.location.href = "/";
    }
    // if (result?.error?.originalStatus === 403) {
    //     api.dispatch(logOut())
    // } else if (result?.error?.status === 401 && result?.error?.data?.logged === 0) {
    //     api.dispatch(logOut())
    // }

    return result
}


export const
    apiSlice = createApi({
        baseQuery: baseQueryWithReauth,
        endpoints: builder => ({}),
    })
