import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now,expires:'24h'}
});

const PriceModel = mongoose.model('Price', PriceSchema);

export default PriceModel;
