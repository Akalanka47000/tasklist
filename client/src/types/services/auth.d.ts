import { RequestConfig, RequestCreateConfig } from './common';

export interface LoginConfig extends RequestCreateConfig {}

export type ILoginResponse = IAPIResponse<IUser>;

export interface RegisterConfig extends RequestCreateConfig {}

export interface IRegisterResponse extends ILoginResponse {}

export interface CurrentConfig extends RequestConfig {}

export type ICurrentUserResponse = IAPIResponse<IUser>;

export interface LogoutConfig extends RequestConfig {}

export type ILogoutResponse = IAPIResponse;
