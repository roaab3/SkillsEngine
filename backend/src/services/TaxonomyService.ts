import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import { AIService } from './AIService';
import { Skill, Competency } from '../types';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class TaxonomyService {
  private taxonomyRepository: TaxonomyRepository;
  private aiService: AIService;

  constructor() {
    this.taxonomyRepository = new TaxonomyRepository();
    this.aiService = new AIService();
  }

  async getMGSForCompetency(competencyName: string): Promise<Skill[]> {
    // First, try to find competency by name
    let competency = await this.taxonomyRepository.getCompetencyByName(competencyName);
    
    if (!competency) {
      return [];
    }

    // Get MGS using the view
    return await this.taxonomyRepository.getMGSForCompetency(competency.competency_id);
  }

  async getMGSForCompetencyWithDiscovery(competencyName: string): Promise<Skill[]> {
    // Normalize competency name using AI
    const normalizedName = await this.aiService.normalizeCompetencyName(competencyName);
    
    // Try to find competency
    let competency = await this.taxonomyRepository.getCompetencyByName(normalizedName);
    
    // If not found, try external discovery
    if (!competency) {
      logger.info(`Competency "${competencyName}" not found, attempting external discovery`);
      const discoveredCompetency = await this.aiService.discoverExternalCompetency(competencyName);
      
      if (discoveredCompetency) {
        // Add to database
        await this.taxonomyRepository.addCompetency(discoveredCompetency);
        competency = discoveredCompetency;
      } else {
        throw new NotFoundError('Competency');
      }
    }

    // Get MGS
    return await this.taxonomyRepository.getAllMGSForCompetency(competency.competency_id);
  }

  async normalizeCompetencyName(name: string): Promise<string> {
    return await this.aiService.normalizeCompetencyName(name);
  }

  async getCompetencyById(competencyId: string): Promise<Competency> {
    const competency = await this.taxonomyRepository.getCompetencyById(competencyId);
    if (!competency) {
      throw new NotFoundError('Competency');
    }
    return competency;
  }

  async getSkillById(skillId: string): Promise<Skill> {
    const skill = await this.taxonomyRepository.getSkillById(skillId);
    if (!skill) {
      throw new NotFoundError('Skill');
    }
    return skill;
  }
}

