import { Request, Response } from 'express';
import { products, getProductById, getProductsByCategory } from '../data/products';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, inStock } = req.query;
    
    let filteredProducts = products;
    
    // Filter by category if provided
    if (category && typeof category === 'string') {
      filteredProducts = getProductsByCategory(category);
    }
    
    // Filter by stock status if provided
    if (inStock !== undefined) {
      const stockFilter = inStock === 'true';
      filteredProducts = filteredProducts.filter(product => product.inStock === stockFilter);
    }
    
    res.status(200).json({
      success: true,
      data: filteredProducts,
      message: `Retrieved ${filteredProducts.length} products`,
      total: filteredProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching products',
      message: 'Failed to retrieve products',
    });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Product ID is required',
        message: 'Please provide a valid product ID',
      });
      return;
    }
    
    const product = getProductById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching product',
      message: 'Failed to retrieve product',
    });
  }
};

export const getProductCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = [...new Set(products.map(product => product.category))];
    
    res.status(200).json({
      success: true,
      data: categories,
      message: 'Product categories retrieved successfully',
      total: categories.length,
    });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching categories',
      message: 'Failed to retrieve product categories',
    });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q: query, minPrice, maxPrice } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
        message: 'Please provide a search term',
      });
      return;
    }
    
    let filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Filter by price range if provided
    if (minPrice && typeof minPrice === 'string') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }
    }
    
    if (maxPrice && typeof maxPrice === 'string') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }
    }
    
    res.status(200).json({
      success: true,
      data: filteredProducts,
      message: `Found ${filteredProducts.length} products matching "${query}"`,
      total: filteredProducts.length,
      query: query,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while searching products',
      message: 'Failed to search products',
    });
  }
};
