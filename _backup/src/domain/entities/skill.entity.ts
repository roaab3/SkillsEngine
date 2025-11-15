import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { Competency } from './competency.entity';
import { UserSkill } from './user-skill.entity';
import { SkillHierarchy } from './skill-hierarchy.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // L1, L2, L3, L4

  @Column({ type: 'varchar', length: 100, nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_id: string;

  @Column({ type: 'uuid', nullable: true })
  company_id: string; // null for global skills

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToMany(() => Competency, competency => competency.skills)
  @JoinTable({
    name: 'competency_skill',
    joinColumn: { name: 'skill_id' },
    inverseJoinColumn: { name: 'competency_id' }
  })
  competencies: Competency[];

  @OneToMany(() => UserSkill, userSkill => userSkill.skill)
  user_skills: UserSkill[];

  @OneToMany(() => SkillHierarchy, hierarchy => hierarchy.parent_skill)
  parent_relationships: SkillHierarchy[];

  @OneToMany(() => SkillHierarchy, hierarchy => hierarchy.child_skill)
  child_relationships: SkillHierarchy[];

  constructor(partial: Partial<Skill> = {}) {
    Object.assign(this, partial);
  }
}

