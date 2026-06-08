// ============================================================================
// VOLKSCHEM OMS — Product Controller
// ============================================================================

const productService = require('../services/productService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function getAllProducts(req, res, next) {
  try {
    const filters = {
      order_type: req.query.order_type,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
    };
    const products = await productService.getAllProducts(filters);
    return sendSuccess(res, products, 'Products retrieved.');
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    return sendSuccess(res, product, 'Product retrieved.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { product_code, product_name, bulk_rate_per_ltr_kg, rate_unit, order_type } = req.body;

    const errors = [];
    if (!product_code) errors.push('Product code is required.');
    if (!product_name) errors.push('Product name is required.');
    if (!bulk_rate_per_ltr_kg) errors.push('Bulk rate per ltr/kg is required.');
    if (!rate_unit || !['ltr', 'kg'].includes(rate_unit)) errors.push('Rate unit must be "ltr" or "kg".');
    if (!order_type || !['gujarat_brand', 'third_party'].includes(order_type)) {
      errors.push('Order type must be "gujarat_brand" or "third_party".');
    }
    if (errors.length > 0) return sendValidationError(res, errors);

    const product = await productService.createProduct(req.body, req.user.id);
    return sendSuccess(res, product, 'Product created.', 201);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, product, 'Product updated.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await productService.deleteProduct(req.params.id);
    return sendSuccess(res, product, 'Product deactivated.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
