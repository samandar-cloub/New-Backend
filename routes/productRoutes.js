import express from 'express';
import formidable from 'express-formidable';
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  searchProductController,
  updateProductController,
} from '../controllers/productController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Get products
router.get('/get-product', getProductController);

// Get single product
router.get('/get-product/:slug', getSingleProductController);

// Get photo
router.get('/product-photo/:pid', productPhotoController);

// Update product
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Delete product
router.delete('/delete-product/:pid', deleteProductController);

// Filter product
router.post('/product-filters', productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

export default router;
