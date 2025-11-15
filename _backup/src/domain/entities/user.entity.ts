import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserSkill } from './user-skill.entity';
import { UserCompetency } from './user-competency.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => UserSkill, userSkill => userSkill.user)
  user_skills: UserSkill[];

  @OneToMany(() => UserCompetency, userCompetency => userCompetency.user)
  user_competencies: UserCompetency[];

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}

