export interface IUser {
  /**
   * @description Date
   */
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: IUserIdentity[];
  locale: string; //it
  name: string;
  nickname: string;
  /**
   * @description picture url
   */
  picture: string;
  /**
   * @description Date
   */
  updated_at: string;
  /**
   * @description <provider>|<user_id>
   */
  user_id: string;
  /**
   * @description IPv6
   */
  last_ip: string;
  /**
   * @description Date
   */
  last_login: string;
  logins_count: number;
}

export interface IUserIdentity {
  provider: string; //"google-oauth2"
  user_id: string;
  connection: string;
  isSocial: boolean;
}
