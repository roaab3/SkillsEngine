import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Skill } from './skill.entity';

@Entity('skill_hierarchy')
export class SkillHierarchy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  parent_skill_id: string;

  @Column({ type: 'uuid' })
  child_skill_id: string;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Skill, skill => skill.parent_relationships)
  @JoinColumn({ name: 'parent_skill_id' })
  parent_skill: Skill;

  @ManyToOne(() => Skill, skill => skill.child_relationships)
  @JoinColumn({ name: 'child_skill_id' })
  child_skill: Skill;

  constructor(partial: Partial<SkillHierarchy> = {}) {
    Object.assign(this, partial);
  }
}

