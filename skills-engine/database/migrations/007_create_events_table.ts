import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('event_type', 100).notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.json('event_data').notNullable();
    table.string('source', 100); // assessment, manual, etc.
    table.string('status', 20).defaultTo('pending'); // pending, processed, failed
    table.timestamp('processed_at');
    table.text('error_message');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['event_type']);
    table.index(['user_id']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('events');
}
