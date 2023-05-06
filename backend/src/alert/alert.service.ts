import {Request} from 'express';

import Alert from "./alert.model";

const createAlert = async(
    
    symbol: string,
    title: string,
    price: number,
    target: number,
    alertname: string,
    notes: string,
    expiresAt: number

)=> {
      
        
        const alert = new Alert({
            symbol,
            title,
            price,
            target,
            alertname,
            notes,
            expiresAt ,

       });

        return await alert.save();

    

       
};

export{createAlert};