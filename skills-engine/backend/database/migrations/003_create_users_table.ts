import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('external_id', 100).notNullable().unique(); // ID from Directory service
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('role', 100);
    table.string('department', 100);
    table.json('profile_data'); // Additional profile information
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['external_id']);
    table.index(['email']);
    table.index(['role']);
    table.index(['department']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
