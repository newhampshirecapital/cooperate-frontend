export interface RegisterPayload {
    name:string;
    email: string;
    password: string;
    phone: string;
}


export interface VerifyOTPPayload {
    otp: string;
}

export interface ResendOTPPayload {
    email: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email:string;
}

export interface ResetPasswordPayload {
    password: string;
    token: string;
}