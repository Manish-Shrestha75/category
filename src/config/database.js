import 'dotenv/config';

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    'src/entities/user.js',
    'src/entities/category.js', 
    'src/entities/subcategory.js',
    'src/entities/product.js',
    'src/entities/cart.js',
    'src/entities/wishlist.js'

  ],
  synchronize: true,
  logging: false
};