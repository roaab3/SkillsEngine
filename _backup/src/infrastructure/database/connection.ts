import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { logger } from '../logger/logger';

// Entities
import { User } from '@/domain/entities/user.entity';
import { Skill } from '@/domain/entities/skill.entity';
import { Competency } from '@/domain/entities/competency.entity';
import { UserSkill } from '@/domain/entities/user-skill.entity';
import { UserCompetency } from '@/domain/entities/user-competency.entity';
import { SkillHierarchy } from '@/domain/entities/skill-hierarchy.entity';
import { CompetencyHierarchy } from '@/domain/entities/competency-hierarchy.entity';

config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.NODE_ENV === 'development' ? 'skills_engine_dev.db' : 'skills_engine.db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Skill,
    Competency,
    UserSkill,
    UserCompetency,
    SkillHierarchy,
    CompetencyHierarchy
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts']
});

export async function connectDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database connection established successfully');
    }
  } catch (error) {
    logger.error('Error connecting to database:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('Database connection closed successfully');
    }
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
}
