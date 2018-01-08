const mongoose = require('mongoose');

const SALE_STATUS = ['On-Stand', 'Not-Available', 'Pre-Order', 'Discontinued'];

let productSchema = new mongoose.Schema({
  products:[{
    name: {type:String, required:true},
    productCode: {type: String, required: true},
    vendorCode: {type: String, required: true},
    price: {type: Number, required: true}
  }]
});

let vendorSchema = new mongoose.Schema({
  name: {type:String, required:true},
  vendorCode: {type: String, required: true},
  contactEmail: {type: String, required: true},
  sellerRank: {type: Number, required: true}
});

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  productcode: { type: String, unique: true, required: true },
  // REFERENCE
  vendor: { type: String, require: true },
  sku: { type: String, required: true },
  price: { type: Number, default: 0, min: 1, max: 99999 },
  status: { type: String, enum: SALE_STATUS, default: 'Not-Available', required: true },
  quantity: { type: String, required: true, default: true },
  addedOn: { type: Date, default: Date.now },
  // REFERENCE
  addedBy: { type: String, required: true },
  // EMBEDDED
  spec: {
    color: { type: String },
    size: { type: String },
    weight: { type: Number, default: 0, min: 0, max: 999 },
  },
  // EMBEDDED
  reviews: [{
    rank: { type: Number, required: true },
    reviewer: { type: String, required: true },
    comments: { type: String },
    reviewedOn: { type: Date, default: Date.now }
  }],
  // EMBEDDED
  tags: []
}, { collection: 'products' });

// Virtual column, will not be persisted in dB
schema.virtual('canAddToCart')
  .get(function() {
    return (this.status === 'On-Stand');
  });

schema.statics = {
  // methods which operate at collection
  // Caution: cannot use arrow functions
  // Eg: findByVendor
}

schema.methods = {
  // method which operate on the instance or at document
  // Caution: cannot use arrow functions
  // Eg: getDiscountedPrice
}

schema.path('quantity').validate = function(quantity) {
  // Return true or false
  // Quantity cannot be in negative
  return !(quantity < 0)
}

// Validation hooks
schema.pre('save', function() {
  if(this.spec.weight <= 0) {
    next(new Error('weight is invalid'));
    return;
  }
});

// Composite Unique key
schema.index({
  code: 1,
  sku: 1,
  vendor: 1,
}, {
  unique: true
});



//Creating the model, model is the runtime object instance of the schema
let schemaProducts = mongoose.model("products", schema);
let productsSchema = mongoose.model('productData', productSchema);
let vendorsSchema = mongoose.model('vendorData', vendorSchema);

// let productsModelSchema = new productsSchema ({
//   products:[
//     {
//       "name":"Lenovo Smart Scale",
//       "productCode":"HS10",
//       "vendorCode":"appario_101",
//       "price":3999
//     },
//     {
//       "name":"Lenovo PHAB",
//       "productCode":"PH220",
//       "vendorCode":"Micro_200",
//       "price":10000
//     }
//   ]
// });

// productsModelSchema.save(function (err) {if (err) console.log ('Error on save!')});

// let vendorModelSchema = new vendorsSchema ({
//   "name":"Lenovo Smart Scale",
//   "vendorCode": "appario_101",
//   "contactEmail": "sudhir.madaan@gmail.com",
//   "sellerRank": 1
// });

// vendorModelSchema.save(function (err) {if (err) console.log ('Error on save!')});

module.exports = {
  schemaProducts,
  productsSchema,
  vendorsSchema
}




