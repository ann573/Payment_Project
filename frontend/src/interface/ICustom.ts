export interface ICustomer {
    name:string,
    telephone: string,
    _id: string,
    score: number,
    orders: [{
        _id: string,
        total: number
    }]
}