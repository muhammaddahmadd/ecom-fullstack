import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: products,
      message: 'Products retrieved successfully',
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: 'Internal server error'
    });
  }
};

export const getProductCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: 'Internal server error'
    });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
        message: 'Please provide a search term'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: products,
      message: `Found ${products.length} products matching "${q}"`,
      count: products.length
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: 'Internal server error'
    });
  }
};
