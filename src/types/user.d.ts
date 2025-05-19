export interface CreateUserTypes {
    email: string;
    password: string;
    role: string
}

export interface UserLoginTypes {
    email: string;
    password: string;
}

export interface iUserForgotPasswordTypes {
    email: string
}

export interface iValidateResetTokenTypes {
    email: string;
    token: string;
}

export interface iResetPasswordTypes {
    email: string;
    token: string;
    password: string;
}