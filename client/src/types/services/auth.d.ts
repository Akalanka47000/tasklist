import { RequestConfig } from './common';

export interface LoginConfig extends RequestConfig {
  data: any;
}

export interface ILoginResponse {
  message: string;
  data: {
    user: IUser;
  };
}

export interface RegisterConfig extends RequestConfig {
  data: any;
}

export interface IRegisterResponse extends ILoginResponse {}

export interface CurrentConfig extends RequestConfig {}

export interface ICurrentUserResponse {
  message: string;
  data: IUser;
}

export interface LogoutConfig extends RequestConfig {}

export interface ILogoutResponse {
  message: string;
}
