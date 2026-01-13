import { LoginRequest } from "./loginRequest.model";

export interface RegisterRequest extends LoginRequest{
    name: string;
}