import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255),
        "company_id" uuid NOT NULL,
        "role" character varying(100),
        "department" character varying(100),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create skills table
    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "type" character varying(50) NOT NULL,
        "code" character varying(100),
        "description" text,
        "external_id" character varying(255),
        "company_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_skills" PRIMARY KEY ("id")
      )
    `);

    // Create competencies table
    await queryRunner.query(`
      CREATE TABLE "competencies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "behavioral_definition" text,
        "category" character varying(100),
        "description" text,
        "standard_id" character varying(255),
        "company_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_competencies" PRIMARY KEY ("id")
      )
    `);

    // Create user_skills table
    await queryRunner.query(`
      CREATE TABLE "user_skills" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "skill_id" uuid NOT NULL,
        "verified" boolean NOT NULL DEFAULT false,
        "verification_source" character varying(100),
        "last_evaluate" TIMESTAMP,
        "proficiency_score" decimal(5,2),
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_skills" PRIMARY KEY ("id")
      )
    `);

    // Create user_competencies table
    await queryRunner.query(`
      CREATE TABLE "user_competencies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "competency_id" uuid NOT NULL,
        "level" character varying(50),
        "progress_percentage" decimal(5,2) NOT NULL DEFAULT 0,
        "verification_source" character varying(100),
        "last_evaluate" TIMESTAMP,
        "target_level" character varying(50),
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_competencies" PRIMARY KEY ("id")
      )
    `);

    // Create competency_skill junction table
    await queryRunner.query(`
      CREATE TABLE "competency_skill" (
        "competency_id" uuid NOT NULL,
        "skill_id" uuid NOT NULL,
        CONSTRAINT "PK_competency_skill" PRIMARY KEY ("competency_id", "skill_id")
      )
    `);

    // Create skill_hierarchy table
    await queryRunner.query(`
      CREATE TABLE "skill_hierarchy" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "parent_skill_id" uuid NOT NULL,
        "child_skill_id" uuid NOT NULL,
        "level" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_skill_hierarchy" PRIMARY KEY ("id")
      )
    `);

    // Create competency_hierarchy table
    await queryRunner.query(`
      CREATE TABLE "competency_hierarchy" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "parent_competency_id" uuid NOT NULL,
        "child_competency_id" uuid NOT NULL,
        "level" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_competency_hierarchy" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "user_skills" 
      ADD CONSTRAINT "FK_user_skills_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_skills" 
      ADD CONSTRAINT "FK_user_skills_skill_id" 
      FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_competencies" 
      ADD CONSTRAINT "FK_user_competencies_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_competencies" 
      ADD CONSTRAINT "FK_user_competencies_competency_id" 
      FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "competency_skill" 
      ADD CONSTRAINT "FK_competency_skill_competency_id" 
      FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "competency_skill" 
      ADD CONSTRAINT "FK_competency_skill_skill_id" 
      FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "skill_hierarchy" 
      ADD CONSTRAINT "FK_skill_hierarchy_parent_skill_id" 
      FOREIGN KEY ("parent_skill_id") REFERENCES "skills"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "skill_hierarchy" 
      ADD CONSTRAINT "FK_skill_hierarchy_child_skill_id" 
      FOREIGN KEY ("child_skill_id") REFERENCES "skills"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "competency_hierarchy" 
      ADD CONSTRAINT "FK_competency_hierarchy_parent_competency_id" 
      FOREIGN KEY ("parent_competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "competency_hierarchy" 
      ADD CONSTRAINT "FK_competency_hierarchy_child_competency_id" 
      FOREIGN KEY ("child_competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_users_company_id" ON "users" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_skills_company_id" ON "skills" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_skills_type" ON "skills" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_competencies_company_id" ON "competencies" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_skills_user_id" ON "user_skills" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_skills_skill_id" ON "user_skills" ("skill_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_competencies_user_id" ON "user_competencies" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_competencies_competency_id" ON "user_competencies" ("competency_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_user_competencies_competency_id"`);
    await queryRunner.query(`DROP INDEX "IDX_user_competencies_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_user_skills_skill_id"`);
    await queryRunner.query(`DROP INDEX "IDX_user_skills_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_competencies_company_id"`);
    await queryRunner.query(`DROP INDEX "IDX_skills_type"`);
    await queryRunner.query(`DROP INDEX "IDX_skills_company_id"`);
    await queryRunner.query(`DROP INDEX "IDX_users_company_id"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "competency_hierarchy" DROP CONSTRAINT "FK_competency_hierarchy_child_competency_id"`);
    await queryRunner.query(`ALTER TABLE "competency_hierarchy" DROP CONSTRAINT "FK_competency_hierarchy_parent_competency_id"`);
    await queryRunner.query(`ALTER TABLE "skill_hierarchy" DROP CONSTRAINT "FK_skill_hierarchy_child_skill_id"`);
    await queryRunner.query(`ALTER TABLE "skill_hierarchy" DROP CONSTRAINT "FK_skill_hierarchy_parent_skill_id"`);
    await queryRunner.query(`ALTER TABLE "competency_skill" DROP CONSTRAINT "FK_competency_skill_skill_id"`);
    await queryRunner.query(`ALTER TABLE "competency_skill" DROP CONSTRAINT "FK_competency_skill_competency_id"`);
    await queryRunner.query(`ALTER TABLE "user_competencies" DROP CONSTRAINT "FK_user_competencies_competency_id"`);
    await queryRunner.query(`ALTER TABLE "user_competencies" DROP CONSTRAINT "FK_user_competencies_user_id"`);
    await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_user_skills_skill_id"`);
    await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_user_skills_user_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "competency_hierarchy"`);
    await queryRunner.query(`DROP TABLE "skill_hierarchy"`);
    await queryRunner.query(`DROP TABLE "competency_skill"`);
    await queryRunner.query(`DROP TABLE "user_competencies"`);
    await queryRunner.query(`DROP TABLE "user_skills"`);
    await queryRunner.query(`DROP TABLE "competencies"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

