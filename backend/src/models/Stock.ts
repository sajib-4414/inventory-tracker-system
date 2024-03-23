import mongoose from "mongoose";
import { PaintDoc } from "./Paint";

interface StockDoc extends mongoose.Document{
    quantity: number;
    paintColor: string;
    paint: PaintDoc;
}

const StockSchema = new mongoose.Schema<StockDoc>({
    quantity:{
        type: Number,
        required: [true, 'Please add quantity']
    },
    paintColor:{
        type: String,
        required: [true, 'Please add paint color']
    },
    paint:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paint'
    }
})


const Stock = mongoose.model<StockDoc>('Stock', StockSchema);

export{StockDoc, Stock}