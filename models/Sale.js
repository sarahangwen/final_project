const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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
  saleDate: {
    type: Date,
    required: true
  },
  saleTime: {
    type: String,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerKg: {
    type: Number,
    required: true,
    min: 1000
  // },
  // total: {
  //   type: Number,
  //   required: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerContact: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    enum: ['Maganjo', 'Matugga'],
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'mobileMoney'],
    required: true
  }
}, { timestamps: true });

// Before saving, calculate total automatically
saleSchema.pre('save', function (next) {
  this.total = this.quantitySold * this.pricePerKg;
  next();
});

module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
