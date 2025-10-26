import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('competencies', (table) => {
    table.increments('id').primary();
    table.string('code', 50).notNullable().unique();
    table.string('name', 255).notNullable();
    table.text('description');
    table.string('level', 20).notNullable(); // L1, L2, L3, L4
    table.integer('parent_id').unsigned().references('id').inTable('competencies');
    table.string('external_id', 100); // For external taxonomy integration
    table.string('external_source', 50); // SFIA, ESCO, etc.
    table.json('metadata'); // Additional metadata
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['code']);
    table.index(['level']);
    table.index(['parent_id']);
    table.index(['external_id', 'external_source']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('competencies');
}
