const productService = require('./products.service');
const async = require('async');

const addNewProduct = function(newProduct, done) {
  productService.addNewProduct(newProduct, done);
}

const submitReview = function(productCode, reviewObj, done) {
	productService.submitNewReview(productCode, reviewObj, done);
}

const getProducts = function(done) {
  productService.getProducts(done);
}

const findProductByCode = function(productCode, done) {
	async.waterfall([
		productService.findProductByCode.bind(null, productCode),
		productService.productByVendorCode
	], (err, result) => {
		done(err, result);
	});
}


module.exports = {
  addNewProduct,
  getProducts,
  submitReview,
  findProductByCode
}