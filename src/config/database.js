import 'dotenv/config';
import Category from '../entities/category.js';
import Subcategory from '../entities/subcategory.js';
import Product from '../entities/product.js';

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Subcategory, Product],
  synchronize: true,
  logging: false
};