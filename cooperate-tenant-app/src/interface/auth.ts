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

export interface UpdateUserPayload {
    name: string;
    email:string;
    phone:string;
    address?:Address;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
   
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export interface CreateComplaintPayload {
    name: string;
    cooperativeId: string;
    userId: string;
    message:string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    
}