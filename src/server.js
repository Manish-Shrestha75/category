import express from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import dbConfig from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subcategoryRoutes from './routes/subcategoryRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

createConnection(dbConfig)
  .then(() => {
    console.log("Database Connected Successfully");

    
    app.use('/api/categories', categoryRoutes);
    app.use('/api/subcategories', subcategoryRoutes);
    app.use('/api/products', productRoutes);

    app.get('/', (req, res) => {
      res.json({ message: 'Category-Product API is working!' });
    });

    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });