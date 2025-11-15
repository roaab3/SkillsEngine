import { AppDataSource } from '../infrastructure/database/connection';
import { User } from '../domain/entities/user.entity';
import { Skill } from '../domain/entities/skill.entity';
import { Competency } from '../domain/entities/competency.entity';
import { UserSkill } from '../domain/entities/user-skill.entity';
import { UserCompetency } from '../domain/entities/user-competency.entity';
import { SkillHierarchy } from '../domain/entities/skill-hierarchy.entity';
import { CompetencyHierarchy } from '../domain/entities/competency-hierarchy.entity';

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Clear existing data
    await AppDataSource.query('TRUNCATE TABLE user_competencies, user_skills, competency_skill, skill_hierarchy, competency_hierarchy, competencies, skills, users RESTART IDENTITY CASCADE');

    // Create sample company
    const companyId = 'company-123';

    // Create sample users
    const userRepository = AppDataSource.getRepository(User);
    const users = [
      userRepository.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        company_id: companyId,
        role: 'Software Engineer',
        department: 'Engineering'
      }),
      userRepository.create({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        company_id: companyId,
        role: 'Product Manager',
        department: 'Product'
      })
    ];
    await userRepository.save(users);
    console.log('Created users:', users.length);

    // Create sample skills
    const skillRepository = AppDataSource.getRepository(Skill);
    const skills = [
      // L1 - Macro Skills
      skillRepository.create({
        name: 'Software Development',
        type: 'L1',
        code: 'SOFT_DEV',
        description: 'Overall software development capability',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Project Management',
        type: 'L1',
        code: 'PROJ_MGMT',
        description: 'Overall project management capability',
        company_id: companyId
      }),

      // L2 - Meso Skills
      skillRepository.create({
        name: 'Frontend Development',
        type: 'L2',
        code: 'FRONTEND',
        description: 'Frontend development skills',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Backend Development',
        type: 'L2',
        code: 'BACKEND',
        description: 'Backend development skills',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Team Leadership',
        type: 'L2',
        code: 'LEADERSHIP',
        description: 'Team leadership and management',
        company_id: companyId
      }),

      // L3 - Micro Skills
      skillRepository.create({
        name: 'JavaScript',
        type: 'L3',
        code: 'JS',
        description: 'JavaScript programming language',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'React',
        type: 'L3',
        code: 'REACT',
        description: 'React library for building user interfaces',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Node.js',
        type: 'L3',
        code: 'NODE',
        description: 'Node.js runtime environment',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Planning & Scheduling',
        type: 'L3',
        code: 'PLANNING',
        description: 'Project planning and scheduling',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Risk Assessment',
        type: 'L3',
        code: 'RISK',
        description: 'Risk identification and assessment',
        company_id: companyId
      }),

      // L4 - Nano Skills
      skillRepository.create({
        name: 'ES6+ Features',
        type: 'L4',
        code: 'ES6',
        description: 'Modern JavaScript features',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'React Hooks',
        type: 'L4',
        code: 'HOOKS',
        description: 'React hooks for state management',
        company_id: companyId
      }),
      skillRepository.create({
        name: 'Express.js',
        type: 'L4',
        code: 'EXPRESS',
        description: 'Express.js web framework',
        company_id: companyId
      })
    ];
    await skillRepository.save(skills);
    console.log('Created skills:', skills.length);

    // Create skill hierarchy
    const skillHierarchyRepository = AppDataSource.getRepository(SkillHierarchy);
    const skillHierarchies = [
      // Software Development -> Frontend Development -> JavaScript -> ES6+ Features
      skillHierarchyRepository.create({
        parent_skill_id: skills[0].id, // Software Development
        child_skill_id: skills[2].id,  // Frontend Development
        level: 1
      }),
      skillHierarchyRepository.create({
        parent_skill_id: skills[2].id, // Frontend Development
        child_skill_id: skills[5].id,  // JavaScript
        level: 2
      }),
      skillHierarchyRepository.create({
        parent_skill_id: skills[5].id, // JavaScript
        child_skill_id: skills[10].id, // ES6+ Features
        level: 3
      }),

      // Software Development -> Frontend Development -> React -> React Hooks
      skillHierarchyRepository.create({
        parent_skill_id: skills[2].id, // Frontend Development
        child_skill_id: skills[6].id,  // React
        level: 2
      }),
      skillHierarchyRepository.create({
        parent_skill_id: skills[6].id, // React
        child_skill_id: skills[11].id, // React Hooks
        level: 3
      }),

      // Software Development -> Backend Development -> Node.js -> Express.js
      skillHierarchyRepository.create({
        parent_skill_id: skills[0].id, // Software Development
        child_skill_id: skills[3].id,  // Backend Development
        level: 1
      }),
      skillHierarchyRepository.create({
        parent_skill_id: skills[3].id, // Backend Development
        child_skill_id: skills[7].id,  // Node.js
        level: 2
      }),
      skillHierarchyRepository.create({
        parent_skill_id: skills[7].id, // Node.js
        child_skill_id: skills[12].id, // Express.js
        level: 3
      }),

      // Project Management -> Team Leadership
      skillHierarchyRepository.create({
        parent_skill_id: skills[1].id, // Project Management
        child_skill_id: skills[4].id,  // Team Leadership
        level: 1
      }),

      // Project Management -> Planning & Scheduling
      skillHierarchyRepository.create({
        parent_skill_id: skills[1].id, // Project Management
        child_skill_id: skills[8].id,  // Planning & Scheduling
        level: 1
      }),

      // Project Management -> Risk Assessment
      skillHierarchyRepository.create({
        parent_skill_id: skills[1].id, // Project Management
        child_skill_id: skills[9].id,  // Risk Assessment
        level: 1
      })
    ];
    await skillHierarchyRepository.save(skillHierarchies);
    console.log('Created skill hierarchies:', skillHierarchies.length);

    // Create sample competencies
    const competencyRepository = AppDataSource.getRepository(Competency);
    const competencies = [
      competencyRepository.create({
        name: 'Frontend Development',
        behavioral_definition: 'Ability to create user interfaces using modern web technologies',
        category: 'Technical',
        description: 'Frontend development competency covering UI/UX implementation',
        standard_id: 'SFIA_FRONTEND',
        company_id: companyId
      }),
      competencyRepository.create({
        name: 'Backend Development',
        behavioral_definition: 'Ability to create server-side applications and APIs',
        category: 'Technical',
        description: 'Backend development competency covering server-side programming',
        standard_id: 'SFIA_BACKEND',
        company_id: companyId
      }),
      competencyRepository.create({
        name: 'Project Management',
        behavioral_definition: 'Ability to plan, execute, and deliver projects successfully',
        category: 'Management',
        description: 'Project management competency covering planning and execution',
        standard_id: 'SFIA_PROJECT',
        company_id: companyId
      })
    ];
    await competencyRepository.save(competencies);
    console.log('Created competencies:', competencies.length);

    // Link skills to competencies
    await AppDataSource.query(`
      INSERT INTO competency_skill (competency_id, skill_id) VALUES
      ('${competencies[0].id}', '${skills[2].id}'), -- Frontend Development -> Frontend Development
      ('${competencies[0].id}', '${skills[5].id}'), -- Frontend Development -> JavaScript
      ('${competencies[0].id}', '${skills[6].id}'), -- Frontend Development -> React
      ('${competencies[0].id}', '${skills[10].id}'), -- Frontend Development -> ES6+ Features
      ('${competencies[0].id}', '${skills[11].id}'), -- Frontend Development -> React Hooks
      ('${competencies[1].id}', '${skills[3].id}'), -- Backend Development -> Backend Development
      ('${competencies[1].id}', '${skills[7].id}'), -- Backend Development -> Node.js
      ('${competencies[1].id}', '${skills[12].id}'), -- Backend Development -> Express.js
      ('${competencies[2].id}', '${skills[1].id}'), -- Project Management -> Project Management
      ('${competencies[2].id}', '${skills[4].id}'), -- Project Management -> Team Leadership
      ('${competencies[2].id}', '${skills[8].id}'), -- Project Management -> Planning & Scheduling
      ('${competencies[2].id}', '${skills[9].id}')  -- Project Management -> Risk Assessment
    `);

    // Create user skills
    const userSkillRepository = AppDataSource.getRepository(UserSkill);
    const userSkills = [
      // John Doe's skills
      userSkillRepository.create({
        user_id: users[0].id,
        skill_id: skills[5].id, // JavaScript
        verified: true,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        proficiency_score: 85
      }),
      userSkillRepository.create({
        user_id: users[0].id,
        skill_id: skills[6].id, // React
        verified: true,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        proficiency_score: 78
      }),
      userSkillRepository.create({
        user_id: users[0].id,
        skill_id: skills[10].id, // ES6+ Features
        verified: true,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        proficiency_score: 92
      }),
      userSkillRepository.create({
        user_id: users[0].id,
        skill_id: skills[7].id, // Node.js
        verified: false,
        verification_source: 'User Claims',
        last_evaluate: new Date(),
        proficiency_score: 45
      }),

      // Jane Smith's skills
      userSkillRepository.create({
        user_id: users[1].id,
        skill_id: skills[8].id, // Planning & Scheduling
        verified: true,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        proficiency_score: 88
      }),
      userSkillRepository.create({
        user_id: users[1].id,
        skill_id: skills[9].id, // Risk Assessment
        verified: true,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        proficiency_score: 75
      }),
      userSkillRepository.create({
        user_id: users[1].id,
        skill_id: skills[4].id, // Team Leadership
        verified: false,
        verification_source: 'User Claims',
        last_evaluate: new Date(),
        proficiency_score: 60
      })
    ];
    await userSkillRepository.save(userSkills);
    console.log('Created user skills:', userSkills.length);

    // Create user competencies
    const userCompetencyRepository = AppDataSource.getRepository(UserCompetency);
    const userCompetencies = [
      // John Doe's competencies
      userCompetencyRepository.create({
        user_id: users[0].id,
        competency_id: competencies[0].id, // Frontend Development
        level: 'Advanced',
        progress_percentage: 75,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        target_level: 'Expert'
      }),
      userCompetencyRepository.create({
        user_id: users[0].id,
        competency_id: competencies[1].id, // Backend Development
        level: 'Beginner',
        progress_percentage: 25,
        verification_source: 'User Claims',
        last_evaluate: new Date(),
        target_level: 'Intermediate'
      }),

      // Jane Smith's competencies
      userCompetencyRepository.create({
        user_id: users[1].id,
        competency_id: competencies[2].id, // Project Management
        level: 'Intermediate',
        progress_percentage: 65,
        verification_source: 'Assessment',
        last_evaluate: new Date(),
        target_level: 'Advanced'
      })
    ];
    await userCompetencyRepository.save(userCompetencies);
    console.log('Created user competencies:', userCompetencies.length);

    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users, ${skills.length} skills, ${competencies.length} competencies`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };

