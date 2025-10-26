import { MockDataService, MockCompetency, MockSkill, MockUser, MockUserCompetency, MockUserSkill, MockEvent, mockCompetencySkills, mockCompetencySubCompetencies, mockSkillSubSkills } from '../data/mockData';
import { logger } from '../utils/logger';

// Mock database service that simulates database operations using in-memory data
export class MockDatabaseService {
  private static instance: MockDatabaseService;
  private competencies: MockCompetency[] = MockDataService.getCompetencies();
  private skills: MockSkill[] = MockDataService.getSkills();
  private users: MockUser[] = MockDataService.getUsers();
  private userCompetencies: MockUserCompetency[] = MockDataService.getUserCompetencies(0); // Get all
  private userSkills: MockUserSkill[] = MockDataService.getUserSkills(0); // Get all
  private events: MockEvent[] = MockDataService.getEvents();
  private competencySkills = mockCompetencySkills;
  private competencySubCompetencies = mockCompetencySubCompetencies;
  private skillSubSkills = mockSkillSubSkills;

  static getInstance(): MockDatabaseService {
    if (!MockDatabaseService.instance) {
      MockDatabaseService.instance = new MockDatabaseService();
    }
    return MockDatabaseService.instance;
  }

  // Competency operations
  async getCompetencies(filters: any = {}): Promise<{ data: MockCompetency[]; total: number }> {
    try {
      let filteredCompetencies = this.competencies;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCompetencies = filteredCompetencies.filter(c => 
          c.name.toLowerCase().includes(searchTerm) || 
          c.description.toLowerCase().includes(searchTerm)
        );
      }

      const total = filteredCompetencies.length;
      const data = filteredCompetencies.slice(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit
      );

      return { data, total };
    } catch (error) {
      logger.error('Error getting competencies:', error);
      throw error;
    }
  }

  async getCompetencyById(id: number): Promise<MockCompetency | null> {
    try {
      const competency = this.competencies.find(c => c.id === id);
      return competency || null;
    } catch (error) {
      logger.error('Error getting competency by ID:', error);
      throw error;
    }
  }

  async createCompetency(data: Partial<MockCompetency>): Promise<MockCompetency> {
    try {
      const newId = Math.max(...this.competencies.map(c => c.id)) + 1;
      const competency: MockCompetency = {
        id: newId,
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        external_id: data.external_id,
        external_source: data.external_source,
        updated_at: new Date().toISOString()
      };

      this.competencies.push(competency);
      logger.info('Competency created successfully', { competencyId: competency.id });
      return competency;
    } catch (error) {
      logger.error('Error creating competency:', error);
      throw error;
    }
  }

  async updateCompetency(id: number, data: Partial<MockCompetency>): Promise<MockCompetency | null> {
    try {
      const index = this.competencies.findIndex(c => c.id === id);
      if (index === -1) return null;

      this.competencies[index] = {
        ...this.competencies[index],
        ...data,
        updated_at: new Date().toISOString()
      };

      logger.info('Competency updated successfully', { competencyId: id });
      return this.competencies[index];
    } catch (error) {
      logger.error('Error updating competency:', error);
      throw error;
    }
  }

  async deleteCompetency(id: number): Promise<boolean> {
    try {
      const index = this.competencies.findIndex(c => c.id === id);
      if (index === -1) return false;

      this.competencies.splice(index, 1);
      
      logger.info('Competency deleted successfully', { competencyId: id });
      return true;
    } catch (error) {
      logger.error('Error deleting competency:', error);
      throw error;
    }
  }

  // Skill operations
  async getSkills(filters: any = {}): Promise<{ data: MockSkill[]; total: number }> {
    try {
      let filteredSkills = this.skills;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredSkills = filteredSkills.filter(s => 
          s.name.toLowerCase().includes(searchTerm) || 
          s.description.toLowerCase().includes(searchTerm)
        );
      }

      const total = filteredSkills.length;
      const data = filteredSkills.slice(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit
      );

      return { data, total };
    } catch (error) {
      logger.error('Error getting skills:', error);
      throw error;
    }
  }

  async getSkillById(id: number): Promise<MockSkill | null> {
    try {
      const skill = this.skills.find(s => s.id === id);
      return skill || null;
    } catch (error) {
      logger.error('Error getting skill by ID:', error);
      throw error;
    }
  }

  async createSkill(data: Partial<MockSkill>): Promise<MockSkill> {
    try {
      const newId = Math.max(...this.skills.map(s => s.id)) + 1;
      const skill: MockSkill = {
        id: newId,
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        external_id: data.external_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.skills.push(skill);
      logger.info('Skill created successfully', { skillId: skill.id });
      return skill;
    } catch (error) {
      logger.error('Error creating skill:', error);
      throw error;
    }
  }

  async updateSkill(id: number, data: Partial<MockSkill>): Promise<MockSkill | null> {
    try {
      const index = this.skills.findIndex(s => s.id === id);
      if (index === -1) return null;

      this.skills[index] = {
        ...this.skills[index],
        ...data,
        updated_at: new Date().toISOString()
      };

      logger.info('Skill updated successfully', { skillId: id });
      return this.skills[index];
    } catch (error) {
      logger.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: number): Promise<boolean> {
    try {
      const index = this.skills.findIndex(s => s.id === id);
      if (index === -1) return false;

      this.skills.splice(index, 1);
      
      logger.info('Skill deleted successfully', { skillId: id });
      return true;
    } catch (error) {
      logger.error('Error deleting skill:', error);
      throw error;
    }
  }

  // User operations
  async getUserById(id: number): Promise<MockUser | null> {
    try {
      const user = this.users.find(u => u.id === id);
      return user || null;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserCompetencies(userId: number, filters: any = {}): Promise<{ data: any[]; total: number }> {
    try {
      let userComps = this.userCompetencies.filter(uc => uc.user_id === userId);

      // Note: is_verified field removed from simplified interface
      // if (filters.verified !== undefined) {
      //   userComps = userComps.filter(uc => uc.is_verified === filters.verified);
      // }

      if (filters.level) {
        userComps = userComps.filter(uc => uc.level === filters.level);
      }

      // Join with competencies data
      const data = userComps.map(uc => {
        const competency = this.competencies.find(c => c.id === uc.competency_id);
        return {
          ...uc,
          competency_name: competency?.name,
          competency_description: competency?.description,
          competency_level: 'Intermediate' // Default level since removed from interface
        };
      });

      const total = data.length;
      const paginatedData = data.slice(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit
      );

      return { data: paginatedData, total };
    } catch (error) {
      logger.error('Error getting user competencies:', error);
      throw error;
    }
  }

  async getUserSkills(userId: number, filters: any = {}): Promise<{ data: any[]; total: number }> {
    try {
      let userSkills = this.userSkills.filter(us => us.user_id === userId);

      if (filters.verified !== undefined) {
        userSkills = userSkills.filter(us => us.is_verified === filters.verified);
      }

      if (filters.level) {
        // Note: level field removed from simplified interface
        // userSkills = userSkills.filter(us => us.level === filters.level);
      }

      // Join with skills data
      const data = userSkills.map(us => {
        const skill = this.skills.find(s => s.id === us.skill_id);
        return {
          ...us,
          skill_name: skill?.name,
          skill_description: skill?.description,
          skill_level: 'Intermediate' // Default level since removed from interface
        };
      });

      const total = data.length;
      const paginatedData = data.slice(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit
      );

      return { data: paginatedData, total };
    } catch (error) {
      logger.error('Error getting user skills:', error);
      throw error;
    }
  }

  async addUserCompetency(userId: number, data: { competency_id: number; level: string }): Promise<MockUserCompetency> {
    try {
      const newId = Math.max(...this.userCompetencies.map(uc => uc.id)) + 1;
      const userCompetency: MockUserCompetency = {
        id: newId,
        user_id: userId,
        competency_id: data.competency_id,
        level: data.level,
        // completion_percentage: 0, // Field removed from simplified interface
        // is_verified: false, // Field removed from simplified interface
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.userCompetencies.push(userCompetency);
      logger.info('User competency added successfully', { userId, competencyId: data.competency_id });
      return userCompetency;
    } catch (error) {
      logger.error('Error adding user competency:', error);
      throw error;
    }
  }

  async updateUserCompetency(userId: number, competencyId: number, data: { level: string }): Promise<MockUserCompetency | null> {
    try {
      const index = this.userCompetencies.findIndex(uc => uc.user_id === userId && uc.competency_id === competencyId);
      if (index === -1) return null;

      this.userCompetencies[index] = {
        ...this.userCompetencies[index],
        level: data.level,
        updated_at: new Date().toISOString()
      };

      logger.info('User competency updated successfully', { userId, competencyId });
      return this.userCompetencies[index];
    } catch (error) {
      logger.error('Error updating user competency:', error);
      throw error;
    }
  }

  async removeUserCompetency(userId: number, competencyId: number): Promise<boolean> {
    try {
      const index = this.userCompetencies.findIndex(uc => uc.user_id === userId && uc.competency_id === competencyId);
      if (index === -1) return false;

      this.userCompetencies.splice(index, 1);
      logger.info('User competency removed successfully', { userId, competencyId });
      return true;
    } catch (error) {
      logger.error('Error removing user competency:', error);
      throw error;
    }
  }

  // Event operations
  async logEvent(eventData: any): Promise<void> {
    try {
      const newId = Math.max(...this.events.map(e => e.id)) + 1;
      const event: MockEvent = {
        id: newId,
        event_type: eventData.event_type,
        user_id: eventData.user_id,
        event_data: eventData.event_data,
        source: eventData.source,
        status: eventData.status || 'pending',
        processed_at: eventData.processed_at,
        error_message: eventData.error_message,
        created_at: new Date().toISOString()
      };

      this.events.push(event);
    } catch (error) {
      logger.error('Error logging event:', error);
      throw error;
    }
  }

  async getEvents(userId?: number): Promise<{ data: MockEvent[]; total: number }> {
    try {
      let filteredEvents = this.events;
      
      if (userId) {
        filteredEvents = this.events.filter(e => e.user_id === userId);
      }

      return { data: filteredEvents, total: filteredEvents.length };
    } catch (error) {
      logger.error('Error getting events:', error);
      throw error;
    }
  }

  // Gap analysis operations
  async getUserSkillGaps(userId: number): Promise<any[]> {
    try {
      // Mock gap analysis - in real implementation, this would calculate actual gaps
      return MockDataService.getSkillGaps(userId);
    } catch (error) {
      logger.error('Error getting user skill gaps:', error);
      throw error;
    }
  }

  // Relationship operations
  async getCompetencySkills(competencyId: number): Promise<any[]> {
    try {
      const competency = await this.getCompetencyById(competencyId);
      if (!competency) return [];

      // Get all skills that belong to this competency
      const competencySkillIds = this.competencySkills
        .filter(cs => cs.competency_id === competencyId)
        .map(cs => cs.skill_id);
      
      const skills = this.skills.filter(skill => competencySkillIds.includes(skill.id));
      return skills;
    } catch (error) {
      logger.error('Error getting competency skills:', error);
      throw error;
    }
  }

  async getSkillsForCompetency(competencyId: number): Promise<MockSkill[]> {
    try {
      const competencySkillIds = this.competencySkills
        .filter(cs => cs.competency_id === competencyId)
        .map(cs => cs.skill_id);
      
      return this.skills.filter(skill => competencySkillIds.includes(skill.id));
    } catch (error) {
      logger.error('Error getting skills for competency:', error);
      throw error;
    }
  }

  async getCompetenciesForSkill(skillId: number): Promise<MockCompetency[]> {
    try {
      const skillCompetencyIds = this.competencySkills
        .filter(cs => cs.skill_id === skillId)
        .map(cs => cs.competency_id);
      
      return this.competencies.filter(competency => skillCompetencyIds.includes(competency.id));
    } catch (error) {
      logger.error('Error getting competencies for skill:', error);
      throw error;
    }
  }

  async getCompetencyTree(competencyId: number): Promise<any> {
    try {
      const competency = await this.getCompetencyById(competencyId);
      if (!competency) return null;

      // Get direct child competencies recursively
      const childCompetencies = this.competencySubCompetencies
        .filter(csc => csc.id_parent === competencyId)
        .map(async csc => {
          const child = this.competencies.find(c => c.id === csc.id_child);
          return child ? await this.getCompetencyTree(child.id) : null;
        });

      const resolvedChildren = await Promise.all(childCompetencies);
      const validChildren = resolvedChildren.filter(Boolean);

      // Get skills for this competency
      const skills = await this.getSkillsForCompetency(competencyId);

      return {
        ...competency,
        children: validChildren,
        skills: skills,
        total_children: validChildren.length,
        total_skills: skills.length,
        description: `This competency includes ${validChildren.length} sub-competencies and ${skills.length} skills`
      };
    } catch (error) {
      logger.error('Error getting competency tree:', error);
      throw error;
    }
  }

  async getCompetencySubCompetencies(parentId: number): Promise<any[]> {
    try {
      const subCompetencies = this.competencySubCompetencies.filter(csc => csc.id_parent === parentId);
      const competencies = subCompetencies.map(csc => {
        return this.competencies.find(c => c.id === csc.id_child);
      }).filter(Boolean);

      return competencies;
    } catch (error) {
      logger.error('Error getting competency sub-competencies:', error);
      throw error;
    }
  }

  async getSkillSubSkills(parentId: number): Promise<any[]> {
    try {
      const subSkills = this.skillSubSkills.filter(sss => sss.id_parent === parentId);
      const skills = subSkills.map(sss => {
        return this.skills.find(s => s.id === sss.id_child);
      }).filter(Boolean);

      return skills;
    } catch (error) {
      logger.error('Error getting skill sub-skills:', error);
      throw error;
    }
  }

  async getSkillTree(skillId: number): Promise<any> {
    try {
      const skill = await this.getSkillById(skillId);
      if (!skill) return null;

      // Get direct child skills recursively
      const childSkills = this.skillSubSkills
        .filter(sss => sss.id_parent === skillId)
        .map(async sss => {
          const child = this.skills.find(s => s.id === sss.id_child);
          return child ? await this.getSkillTree(child.id) : null;
        });

      const resolvedChildren = await Promise.all(childSkills);
      const validChildren = resolvedChildren.filter(Boolean);

      // Get parent skills
      const parentSkills = this.skillSubSkills
        .filter(sss => sss.id_child === skillId)
        .map(sss => {
          const parent = this.skills.find(s => s.id === sss.id_parent);
          return parent;
        })
        .filter(Boolean);

      const level = this.calculateSkillLevel(skillId);

      return {
        ...skill,
        children: validChildren,
        parents: parentSkills,
        total_children: validChildren.length,
        total_parents: parentSkills.length,
        level: level,
        description: `This skill is at level ${level} in the hierarchy with ${validChildren.length} child skills and ${parentSkills.length} parent skills`
      };
    } catch (error) {
      logger.error('Error getting skill tree:', error);
      throw error;
    }
  }

  private calculateSkillLevel(skillId: number): number {
    // Calculate skill level based on hierarchy depth
    const parents = this.skillSubSkills.filter(sss => sss.id_child === skillId);
    if (parents.length === 0) return 1; // Root level
    
    const maxParentLevel = Math.max(...parents.map(p => this.calculateSkillLevel(p.id_parent)));
    return maxParentLevel + 1;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      return {
        status: 'healthy',
        details: {
          competencies: this.competencies.length,
          skills: this.skills.length,
          users: this.users.length,
          userCompetencies: this.userCompetencies.length,
          userSkills: this.userSkills.length,
          events: this.events.length,
          competencySkills: this.competencySkills.length,
          competencySubCompetencies: this.competencySubCompetencies.length,
          skillSubSkills: this.skillSubSkills.length
        }
      };
    } catch (error) {
      logger.error('Error in health check:', error);
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message }
      };
    }
  }
}
