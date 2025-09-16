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

export interface MeterAccountApplicationPayload {
    userId: string;
    cooperativeId: string;
    name:string;
    email:string;
    premiseUse:string;
    electricityProvider:string;
    lga:string;
    houseOwner:boolean;
    landlordName?:string;
    landlordPhone?:string;
    landlordAddress?:string;
    address:Address;
    phone:string;
    typeofHouse:string;
    typeofMeter:MeterType;
    landMark?:string;
    meansOfIdentification:string;
    identificationNumber:string;
    status:MeterAccountStatus;
}

export type MeterType = {
    SINGLE_PHASE: 'SINGLE_PHASE',
    THREE_PHASE: 'THREE_PHASE',
  
}

export type MeterAccountStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
}

export interface MeterApplicationRequestPayload {
    name:string;
    email:string;
    phone:string;
    address:Address;
    nin:string;
    userType:MeterApplicationUserType;
    lga:string;
    occupation:string;
    accountName:string;
    accountNumber:string;
    accountPhoneNumber:string;
    loadSeperation:boolean;
   // loadCapacity:boolean;
    tariffBand:TariffBand;
    electricityBusinessUnit:string;
    moreInfo?:string;
    status:MeterApplicationStatus;
    userId:string;
    cooperativeId:string;
}


export type MeterApplicationUserType = {
    LANDLORD: 'LANDLORD',
    TENANT: 'TENANT',
    OWNER: 'OWNER',
}

export type TariffBand = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
}

export type MeterApplicationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
}

export interface UserMembershipRequestPayload {
    email:string;
    phone:string;
    name:string;
    address:Address;
    type:string;
    occupation:string;
    referralSource:string;
    cooperativeId:string;
}

export interface CreateCooperativePayload {
    name: string;
    description: string;
    address: Address;
    adminId: string;
}
export interface InviteUserInput {
    email:string;
    role:UserRole;
    name:string;
    phone:string;
    adminId:string;
}

export type UserRole = {
    ADMIN: "admin",
    VISITOR: "visitor",
    VENDOR: "vendor",
    SUPER_ADMIN: "super_admin",
    MEMBER: "member",
}