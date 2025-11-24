import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      unique: true
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
    subcategories: {
      type: 'one-to-many',
      target: 'Subcategory',
      inverseSide: 'category'
    }
  }
});