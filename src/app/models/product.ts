
export class Product {
    Id:number;
    ProductCode:string;
    ImageUrl?:string;
    Name:string;
    Price:number;
    Description:string;
    Tags?: number[];
    QuantityInStock:number;
    QuantitySold:number;
}