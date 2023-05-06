import mongoose from "mongoose";
import {body, param} from 'express-validator';
import { binarySearchStockArray } from "../common/utils/stock";
import { stockSymbolData } from "../common/config/constants";

const createalertSchema = [
    body('symbol').custom((value, { req }) => {
        const { id, name } = binarySearchStockArray(stockSymbolData, value);
        if (id === 0) {
          throw new Error('Invalid stock symbol');
        }
    
        req.body.title = name;
    
        return true;
      }),
      body('price')
      .isNumeric()
      .custom((value, {req})=>{
        if(value > req.body.target ){
            throw new Error('The price should be greater than 0 and less than or equal to target value');
        }
        return true;
      }),
      body('target')
      .isNumeric()
      .custom((value,{req})=>{
         if(value < req.body.price){
            throw new Error('The target value should be greater than price.');
         }
         return true;
      }),
      body('expiresAt')
      .custom((value,{req})=>{
          if(value <=0 || value > 32){
            throw new Error('The expire time should be between 1 to 32 days');
          }
        
        return true;
      }),

];

export {createalertSchema};