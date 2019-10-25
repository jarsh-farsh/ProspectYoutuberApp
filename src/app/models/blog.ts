import { IUser } from './user';

export class Blog{
    Id:number;
    Created_by:number;
    Created_at:Date;
    Modified_on:Date;
    Title:string;
    Body:string;
    Comments: number[];
}

export class Comment{
    Id: number;
    User?: number;
    created_at: Date;
    modified_on: Date;
    body:string;
}