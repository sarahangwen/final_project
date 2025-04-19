const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  produceName: {
    type: String,
    enum: ['Maize grains', 'Soya beans', 'Cow peas', 'G-nuts', 'Maize'],
    required: true
  },
  produceType: {
    type: String,
    enum: ['Legume', 'Cereals'],
    required: true
  },
  procureDate: {
    type: Date,
    required: true
  },
  procureTime: {
    type: String,
    required: true
  },
  tonnage: {
    type: Number,
    required: true,
    min: 1
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  dealerName: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    enum: ['Maganjo', 'Matugga'],
    required: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
