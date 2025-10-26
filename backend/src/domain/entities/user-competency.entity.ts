import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Competency } from './competency.entity';

@Entity('user_competencies')
export class UserCompetency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  competency_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string; // Beginner, Intermediate, Advanced, Expert

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress_percentage: number; // 0-100

  @Column({ type: 'varchar', length: 100, nullable: true })
  verification_source: string;

  @Column({ type: 'timestamp', nullable: true })
  last_evaluate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  target_level: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, user => user.user_competencies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Competency, competency => competency.user_competencies)
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  constructor(partial: Partial<UserCompetency> = {}) {
    Object.assign(this, partial);
  }
}

