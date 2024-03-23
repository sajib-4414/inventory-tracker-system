import mongoose from "mongoose";

interface PaintDoc extends mongoose.Document{
    color:string;
    // quantity:number;
}

const PaintSchema = new mongoose.Schema<PaintDoc>({
    color:{
        type: String,
        required: [true, 'Please add a color']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: false }
})

PaintSchema.virtual('quantity', {
    ref: 'Stock', // Reference model
    localField: '_id', // Field from the current model (Paint)
    foreignField: 'paint', // Referenced model field
    justOne: false, // Set to false as in future we can assocaite multipple stock with the paint
    
});

interface PaintModelInterface extends mongoose.Model<PaintDoc>{}
const Paint = mongoose.model<PaintDoc,PaintModelInterface>('Paint', PaintSchema);

export{PaintDoc, Paint}