import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Subcategory',
  tableName: 'subcategories',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar'
    },
    description: {
      type: 'text',
      nullable: true
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: true,
      inverseSide: 'subcategories'
    },
    products: {
      type: 'one-to-many',
      target: 'Product',
      inverseSide: 'subcategory'
    }
  }
});