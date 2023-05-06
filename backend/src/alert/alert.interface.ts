interface Ialert extends Document{
    _id: string;
    symbol: string;
    title: string;
    price: number;
    target:number;
    alertname: string;
    notes: string;
    expiresAt: number;
}

export { Ialert };