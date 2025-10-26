import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('competency_skills', (table) => {
    table.increments('id').primary();
    table.integer('competency_id').unsigned().notNullable().references('id').inTable('competencies').onDelete('CASCADE');
    table.integer('skill_id').unsigned().notNullable().references('id').inTable('skills').onDelete('CASCADE');
    table.boolean('is_required').defaultTo(true);
    table.integer('weight').defaultTo(1); // Weight for skill importance in competency
    table.timestamps(true, true);
    
    // Unique constraint
    table.unique(['competency_id', 'skill_id']);
    
    // Indexes
    table.index(['competency_id']);
    table.index(['skill_id']);
    table.index(['is_required']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('competency_skills');
}
