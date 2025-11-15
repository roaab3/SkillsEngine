import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Skill } from './skill.entity';

@Entity('user_skills')
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  skill_id: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  verification_source: string; // Assessment, Certification, User Claims, AI Extractions

  @Column({ type: 'timestamp', nullable: true })
  last_evaluate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  proficiency_score: number; // 0-100

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, user => user.user_skills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, skill => skill.user_skills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  constructor(partial: Partial<UserSkill> = {}) {
    Object.assign(this, partial);
  }
}

