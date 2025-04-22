import type { Auth } from 'server';
import { RequestCreateConfig } from './common';

export interface LoginConfig extends RequestCreateConfig<Auth.V1.ILoginRequest> {}

export type ILoginResponse = IAPIResponse<IUser>;

export interface RegisterConfig extends RequestCreateConfig<Auth.V1.IRegisterRequest> {}

export type IRegisterResponse = IAPIResponse<IUser>;

export type ICurrentUserResponse = IAPIResponse<IUser>;
