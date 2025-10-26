import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Competency } from './competency.entity';

@Entity('competency_hierarchy')
export class CompetencyHierarchy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  parent_competency_id: string;

  @Column({ type: 'uuid' })
  child_competency_id: string;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Competency, competency => competency.parent_relationships)
  @JoinColumn({ name: 'parent_competency_id' })
  parent_competency: Competency;

  @ManyToOne(() => Competency, competency => competency.child_relationships)
  @JoinColumn({ name: 'child_competency_id' })
  child_competency: Competency;

  constructor(partial: Partial<CompetencyHierarchy> = {}) {
    Object.assign(this, partial);
  }
}

