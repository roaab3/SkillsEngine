import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_competencies', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('competency_id').unsigned().notNullable().references('id').inTable('competencies').onDelete('CASCADE');
    table.string('level', 20).notNullable(); // Missing, Beginner, Intermediate, Advanced, Expert
    table.decimal('completion_percentage', 5, 2).defaultTo(0); // 0.00 to 100.00
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.string('verification_source', 100); // assessment, manual, etc.
    table.json('verification_data'); // Additional verification information
    table.timestamps(true, true);
    
    // Unique constraint
    table.unique(['user_id', 'competency_id']);
    
    // Indexes
    table.index(['user_id']);
    table.index(['competency_id']);
    table.index(['level']);
    table.index(['is_verified']);
    table.index(['verified_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_competencies');
}
