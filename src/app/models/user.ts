export interface IUser{
    Id:number,
    Role:number,
    Username:string,
    Password:string,
    Email:string,
    First_name:string,
    Last_name:string
}

export interface IRole{
    Id:number,
    Type:string
}