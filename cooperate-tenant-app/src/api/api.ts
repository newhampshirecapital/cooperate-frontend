import {createApi,  fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { config } from "../config";
import type { RegisterPayload, VerifyOTPPayload, ResendOTPPayload, LoginPayload } from "../interface/auth";


const baseUrl = config.backendUrl;

// Define the API response structure
interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

// Custom base query that handles token refresh
const baseQueryWithRefresh = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
});


// Wrapper to handle token refresh
const baseQuery = async (args:any, api:any, extraOptions:any  ) => {
    let result = await baseQueryWithRefresh(args, api, extraOptions);
    
    // If the request failed with 401 (Unauthorized), try to refresh the token
    if (result.error && (result.error as any).status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // Try to refresh the token
        const refreshResult = await baseQueryWithRefresh(
          {
            url: 'auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        
        if (refreshResult.data) {
          // Token refresh successful, update localStorage
          const { accessToken, refreshToken: newRefreshToken } = (refreshResult.data as any).data;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry the original request with the new token
          const retryResult = await baseQueryWithRefresh(args, api, extraOptions);
          return retryResult;
        } else {
          // Token refresh failed, clear tokens and return original error
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return result;
        }
      }
    }
      
  // If there's an error and the response is text, extract the error message
  if (result.error && typeof (result.error as any).data === 'string') {
    return {
      ...result,
      error: {
        ...result.error,
        data: { message: (result.error as any).data }
      }
    };
  }
  
  return result;
};


export const API = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Auth', 'User', 'Cooperative', 'Product', 'Order', 'Payment'],
    endpoints:(builder)=>({
        register:builder.mutation<ApiResponse<any>, RegisterPayload>({
            query:(payload)=>({
                url:'auth/signup',
                method:'POST',
                body:payload
            })
        }),
        verifyOTP:builder.mutation<ApiResponse<any>, VerifyOTPPayload>({
            query:(payload)=>({
                url:'auth/verify',
                method:'POST',
                body:payload
            })
        }),
        resendOTP:builder.mutation<ApiResponse<any>, ResendOTPPayload>({
            query:(payload)=>({
                url:'auth/resend-otp',
                method:'POST',
                body:payload
            })
        }),
        login:builder.mutation<ApiResponse<any>, LoginPayload>({
            query:(payload)=>({
                url:'auth/login',
                method:'POST',
                body:payload
            })
        })
    })
})


export const { useRegisterMutation, useVerifyOTPMutation, useResendOTPMutation, useLoginMutation } = API;