import { NextFunction, Request, Response } from "express";

import Alert from "./alert.model";
import { createAlert } from "./alert.service";

const createnewalert = async(req: Request, res:Response, next:NextFunction)=>{

    try{
        const {symbol, title, price, target, alertname, notes, expiresAt} = req.body;
        
        const alert = await createAlert(
            symbol,
            title,
            price,
            target,
            alertname,
            notes,
            expiresAt ,
        );

        res.status(201);
        res.json(alert);

    }catch(error){
        next(error);
    }

};

export{createnewalert};