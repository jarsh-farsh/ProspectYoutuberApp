export interface IUser{
    id:number,
    role:IRole,
    username:string,
    password:string,
    email:string,
    first_name:string,
    last_name:string
}

export interface IRole{
    id:number,
    type:string
}