export interface RegisterRequest{
  email:string;
  password: string;
  fullName : string;
  phoneNumber?:string;
  roles : string[];

}
