const mongoose = require('mongoose');

const creditSaleSchema = new mongoose.Schema({
  creditBuyerName: {
    type: String,
    required: true,
    trim: true
  },
  nationalId: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  creditProduceName: {
    type: String,
    required: true,
    trim: true
  },
  creditTonnage: {
    type: Number,
    required: true
  },
  creditBranchName: {
    type: String,
    enum: ['Maganjo', 'Matugga'], 
    required: true
  },
  typeOfProduce: {
    type: String,
    required: true,
    trim: true
  },
  dateOfDispatch: {
    type: Date,
    required: true
  },
  creditSalesAgentName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  },
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('CreditSale', creditSaleSchema);
