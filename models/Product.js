const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  produceName: {
    type: String,  
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

// ✅ Fix OverwriteModelError issue
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
