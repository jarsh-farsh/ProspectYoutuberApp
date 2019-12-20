import { OrderItem } from './orderItem';
import { IUser } from './user';

export class Order{
    id: number;
    order_num: string;
    user: IUser;
    created_at: Date;
    total_cost?: number;
    items: OrderItem[];
}