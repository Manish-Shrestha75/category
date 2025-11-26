import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Wishlist',
  tableName: 'wishlists',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: true,
      nullable: false
    }
  }
});