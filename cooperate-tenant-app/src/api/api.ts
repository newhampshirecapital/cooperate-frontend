import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";
import type {
  RegisterPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
  ChangePasswordPayload,
  CreateComplaintPayload,
  MeterAccountApplicationPayload,
  MeterApplicationRequestPayload,
  UserMembershipRequestPayload,
  CreateCooperativePayload,
  InviteUserInput,
} from "../interface/auth";
import { secureTokenStorage } from "../lib/secureStorage";

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
  prepareHeaders: async (headers) => {
    const token = await secureTokenStorage.getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper to handle token refresh
const baseQuery = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryWithRefresh(args, api, extraOptions);

  // If the request failed with 401 (Unauthorized), try to refresh the token
  if (result.error && (result.error as any).status === 401) {
    const refreshToken = await secureTokenStorage.getRefreshToken();

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQueryWithRefresh(
        {
          url: "auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Token refresh successful, update secure storage
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as any
        ).data;
        const tokenExpiration = 24 * 60 * 60 * 1000; // 24 hours
        await Promise.all([
          secureTokenStorage.setToken(accessToken, tokenExpiration),
          secureTokenStorage.setRefreshToken(
            newRefreshToken,
            tokenExpiration * 7
          ),
        ]);

        // Retry the original request with the new token
        const retryResult = await baseQueryWithRefresh(args, api, extraOptions);
        return retryResult;
      } else {
        // Token refresh failed, clear tokens and return original error
        await secureTokenStorage.clearTokens();
        return result;
      }
    }
  }

  // If there's an error and the response is text, extract the error message
  if (result.error && typeof (result.error as any).data === "string") {
    return {
      ...result,
      error: {
        ...result.error,
        data: { message: (result.error as any).data },
      },
    };
  }

  return result;
};

export const API = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "User", "Cooperative", "Product", "Order", "Payment"],
  //authentication
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<any>, RegisterPayload>({
      query: (payload) => ({
        url: "auth/signup",
        method: "POST",
        body: payload,
      }),
    }),
    verifyOTP: builder.mutation<ApiResponse<any>, VerifyOTPPayload>({
      query: (payload) => ({
        url: "auth/verify",
        method: "POST",
        body: payload,
      }),
    }),
    resendOTP: builder.mutation<ApiResponse<any>, ResendOTPPayload>({
      query: (payload) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation<ApiResponse<any>, LoginPayload>({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<any>, ForgotPasswordPayload>({
      query: (payload) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<any>, ResetPasswordPayload>({
      query: (payload) => ({
        url: "auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
    changePassword: builder.mutation<
      ApiResponse<any>,
      { id: string; payload: ChangePasswordPayload }
    >({
      query: ({ id, payload }) => ({
        url: `user/change-password/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    //user management
    getUser: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<
      ApiResponse<any>,
      { id: string; payload: UpdateUserPayload }
    >({
      query: ({ id, payload }) => ({
        url: `user/update/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    //complaints
    createComplaint: builder.mutation<ApiResponse<any>, CreateComplaintPayload>(
      {
        query: (payload) => ({
          url: "complaint/submit",
          method: "POST",
          body: payload,
        }),
      }
    ),
    getComplaints: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `complaint/user/${id}`,
        method: "GET",
      }),
    }),
    getComplaintById: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `complaint/${id}`,
        method: "GET",
      }),
    }),

    //meters
    meterAccountApplication: builder.mutation<ApiResponse<any>, MeterAccountApplicationPayload>({
      query: (payload) => ({
        url: "meter/account-application",
        method: "POST",
        body: payload,
      }),
    }),
    getUserMeterAccountApplications: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `meter/account-application/user/${id}`,
        method: "GET",
      }),
    }),
    getMeterAccountApplicationById: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `meter/account-application/${id}`,
        method: "GET",
      }),
    }),
    updateMeterAccountApplication: builder.mutation<ApiResponse<any>, { id: string; payload: MeterAccountApplicationPayload }>({
      query: ({id, payload}) => ({
        url: `meter/account-application/update/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteMeterAccountApplication: builder.mutation<ApiResponse<any>, { id: string }>({
      query: ({id}) => ({
        url: `meter/account-application/delete/${id}`,
        method: "DELETE",
      }),
    }),

    //meter application requests
    createMeterApplicationRequest: builder.mutation<ApiResponse<any>, MeterApplicationRequestPayload>({
      query: (payload) => ({
        url: "meter-application/create",
        method: "POST",
        body: payload,
      }),
    }),
    getUserMeterApplicationRequests: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `meter-application/user/${id}`,
        method: "GET",
      }),
    }),
    getMeterApplicationRequestById: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `meter-application/get/${id}`,
        method: "GET",
      }),
    }),
    updateMeterApplicationRequest: builder.mutation<ApiResponse<any>, { id: string; payload: MeterApplicationRequestPayload }>({
      query: ({id, payload}) => ({
        url: `meter-application/update/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteMeterApplicationRequest: builder.mutation<ApiResponse<any>, { id: string }>({
      query: ({id}) => ({
        url: `meter-application/delete/${id}`,
        method: "DELETE",
      }),
    }),

    //user membership requests
    createUserMembershipRequest: builder.mutation<ApiResponse<any>, UserMembershipRequestPayload>({
      query: (payload) => ({
        url: "user/request-invite",
        method: "POST",
        body: payload,
      }),
    }),

    //cooperative management
    createCooperative: builder.mutation<ApiResponse<any>, CreateCooperativePayload>({
      query: (payload) => ({
        url: "cooperative/create",
        method: "POST",
        body: payload,
      }),
    }),
    getUserCooperatives: builder.query<ApiResponse<any>, void>({
        query: () => ({
          url: `user/cooperative/me`,
          method: "GET",
        }),
      }),

      //admin management
      inviteUser: builder.mutation<ApiResponse<any>, InviteUserInput>({
        query: (payload) => ({
          url: "admin/invite",
          method: "POST",
          body: payload,
        }),
      }),
    }),


    //admin management

  });

export const {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useMeterAccountApplicationMutation,
  useGetUserMeterAccountApplicationsQuery,
  useGetMeterAccountApplicationByIdQuery,
  useUpdateMeterAccountApplicationMutation,
  useCreateMeterApplicationRequestMutation,
  useGetUserMeterApplicationRequestsQuery,
  useGetMeterApplicationRequestByIdQuery,
  useUpdateMeterApplicationRequestMutation,
  useDeleteMeterAccountApplicationMutation,
  useDeleteMeterApplicationRequestMutation,
  useCreateUserMembershipRequestMutation,
  useCreateCooperativeMutation,
  useGetUserCooperativesQuery,
  //admin management
  useInviteUserMutation,
} = API;
