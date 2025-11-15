import { Skill } from '@/domain/entities/skill.entity';

export const MOCK_SKILLS: Skill[] = [
  new Skill({
    id: '11111111-1111-1111-1111-111111111111',
    name: 'JavaScript',
    type: 'L1',
    code: 'SK-JS',
    description: 'Core JavaScript language knowledge and usage',
    external_id: 'ext-js',
    company_id: null as unknown as string, // keep typing compatibility
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    competencies: [],
    user_skills: [],
    parent_relationships: [],
    child_relationships: []
  }),
  new Skill({
    id: '22222222-2222-2222-2222-222222222222',
    name: 'React',
    type: 'L2',
    code: 'SK-REACT',
    description: 'Building user interfaces with React',
    external_id: 'ext-react',
    company_id: null as unknown as string,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    competencies: [],
    user_skills: [],
    parent_relationships: [],
    child_relationships: []
  }),
  new Skill({
    id: '33333333-3333-3333-3333-333333333333',
    name: 'TypeScript',
    type: 'L1',
    code: 'SK-TS',
    description: 'Type-safe JavaScript with TypeScript',
    external_id: 'ext-ts',
    company_id: null as unknown as string,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    competencies: [],
    user_skills: [],
    parent_relationships: [],
    child_relationships: []
  })
];

export function filterAndPaginateSkills(
  skills: Skill[],
  {
    page,
    limit,
    search,
    type,
    company_id
  }: { page: number; limit: number; search?: string; type?: string; company_id?: string }
) {
  let filtered = skills;

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((sk) => sk.name.toLowerCase().includes(s));
  }
  if (type) {
    filtered = filtered.filter((sk) => sk.type === type);
  }
  if (company_id) {
    filtered = filtered.filter((sk) => sk.company_id === company_id);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  const pages = Math.max(1, Math.ceil(total / limit));

  return { data, total, pages };
}




