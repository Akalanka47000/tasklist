declare global {
  interface IUser {
    _id: string | any;
    name: string;
    email: string;
    password?: string;
    last_login_time?: string;
    created_at: string;
    updated_at: string;
    /**
     * @usage server-side
     * @description removes sensitive data from the user object
     */
    cleanse(): IUser;
  }
}

export {};
