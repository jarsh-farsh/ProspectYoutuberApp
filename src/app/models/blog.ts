import { IUser } from './user';

export class Blog{
    id:number;
    user?:IUser;
    confirmed: boolean;
    created_on:Date;
    modified_on:Date;
    title:string;
    body:string;
    comments?: Comment[];
}

export class Comment{
    id: number;
    user?: IUser;
    created_on: Date;
    modified_on: Date;
    body:string;
}