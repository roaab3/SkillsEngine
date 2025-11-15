import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { OfficialSource, Skill, Competency } from '../types';
import { ExternalAPIError } from '../utils/errors';
import logger from '../utils/logger';
import { SourceRepository } from '../repositories/SourceRepository';

export class AIService {
  private flashModel: any;
  private deepSearchModel: any;
  private sourceRepository: SourceRepository;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.deepSearchModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    this.sourceRepository = new SourceRepository();
  }

  async discoverSources(domain: string): Promise<OfficialSource[]> {
    try {
      const promptPath = path.join(__dirname, '../../docs/prompts/source_discovery_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
      const prompt = `${promptTemplate}\n\nDomain: ${domain}`;

      const result = await this.deepSearchModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      const sources: OfficialSource[] = JSON.parse(jsonMatch[0]);

      // Persist sources to database
      for (const source of sources) {
        await this.sourceRepository.addOfficialSource(source);
      }

      return sources;
    } catch (error) {
      logger.error('Error discovering sources:', error);
      // Fallback to mock data
      return this.getMockSources();
    }
  }

  async extractSkillsFromData(rawData: string): Promise<{ competencies: string[]; skills: string[] }> {
    try {
      const promptPath = path.join(__dirname, '../../docs/prompts/skill_extraction_from_profile_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
      const prompt = `${promptTemplate}\n\nRaw Data:\n${rawData}`;

      const result = await this.deepSearchModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Error extracting skills from data:', error);
      throw new ExternalAPIError('Failed to extract skills from data', 'Gemini API');
    }
  }

  async normalizeSkills(skills: string[]): Promise<string[]> {
    try {
      const promptPath = path.join(__dirname, '../../docs/prompts/normalization_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
      const prompt = `${promptTemplate}\n\nSkills to normalize:\n${JSON.stringify(skills, null, 2)}`;

      const result = await this.flashModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Error normalizing skills:', error);
      // Return original skills if normalization fails
      return skills;
    }
  }

  async normalizeCompetencyName(name: string): Promise<string> {
    try {
      const promptPath = path.join(__dirname, '../../docs/prompts/normalization_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
      const prompt = `${promptTemplate}\n\nCompetency name to normalize: ${name}`;

      const result = await this.flashModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract normalized name from response
      const normalized = text.trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '');
      return normalized || name;
    } catch (error) {
      logger.error('Error normalizing competency name:', error);
      return name;
    }
  }

  async mapSkillsToCompetencies(
    skills: Skill[],
    competencies: Competency[]
  ): Promise<Record<string, string[]>> {
    try {
      const promptPath = path.join(__dirname, '../../docs/prompts/skill_to_competency_mapping_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
      const prompt = `${promptTemplate}\n\nSkills:\n${JSON.stringify(skills, null, 2)}\n\nCompetencies:\n${JSON.stringify(competencies, null, 2)}`;

      const result = await this.deepSearchModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Error mapping skills to competencies:', error);
      throw new ExternalAPIError('Failed to map skills to competencies', 'Gemini API');
    }
  }

  async discoverExternalCompetency(competencyName: string): Promise<Competency | null> {
    try {
      const prompt = `Discover information about the competency "${competencyName}". 
      Return a JSON object with: competency_id, competency_name, description, and related skills hierarchy.
      Format: {"competency_id": "...", "competency_name": "...", "description": "...", "skills": [...]}`;

      const result = await this.deepSearchModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      const data = JSON.parse(jsonMatch[0]);
      return {
        competency_id: data.competency_id || `comp_${Date.now()}`,
        competency_name: data.competency_name || competencyName,
        description: data.description,
      };
    } catch (error) {
      logger.error('Error discovering external competency:', error);
      return null;
    }
  }

  private getMockSources(): OfficialSource[] {
    // Fallback mock data
    return [
      {
        source_id: 'mock_source_1',
        source_name: 'Mock Official Source',
        reference_index_url: 'https://example.com',
        reference_type: 'Documentation',
        access_method: 'web_scraping',
        hierarchy_support: true,
        provides: 'Skills and competencies',
        topics_covered: 'General',
        skill_focus: 'General',
        notes: 'Mock data fallback',
      },
    ];
  }
}

