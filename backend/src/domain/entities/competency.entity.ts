import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Skill } from './skill.entity';
import { UserCompetency } from './user-competency.entity';
import { CompetencyHierarchy } from './competency-hierarchy.entity';

@Entity('competencies')
export class Competency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  behavioral_definition: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  standard_id: string;

  @Column({ type: 'uuid', nullable: true })
  company_id: string; // null for global competencies

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToMany(() => Skill, skill => skill.competencies)
  @JoinTable({
    name: 'competency_skill',
    joinColumn: { name: 'competency_id' },
    inverseJoinColumn: { name: 'skill_id' }
  })
  skills: Skill[];

  @OneToMany(() => UserCompetency, userCompetency => userCompetency.competency)
  user_competencies: UserCompetency[];

  @OneToMany(() => CompetencyHierarchy, hierarchy => hierarchy.parent_competency)
  parent_relationships: CompetencyHierarchy[];

  @OneToMany(() => CompetencyHierarchy, hierarchy => hierarchy.child_competency)
  child_relationships: CompetencyHierarchy[];

  constructor(partial: Partial<Competency> = {}) {
    Object.assign(this, partial);
  }
}

