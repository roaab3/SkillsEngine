import { Competency } from '@/domain/entities/competency.entity';

export const MOCK_COMPETENCIES: Competency[] = [
  new Competency({
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Problem Solving',
    behavioral_definition: 'Identifies, analyzes and solves problems effectively',
    category: 'Core',
    description: 'Ability to break down problems and find solutions',
    standard_id: 'STD-PS',
    company_id: null as unknown as string,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [],
    user_competencies: [],
    parent_relationships: [],
    child_relationships: []
  }),
  new Competency({
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Frontend Engineering',
    behavioral_definition: 'Builds maintainable and accessible UIs',
    category: 'Engineering',
    description: 'Modern frontend frameworks and patterns',
    standard_id: 'STD-FE',
    company_id: null as unknown as string,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [],
    user_competencies: [],
    parent_relationships: [],
    child_relationships: []
  })
];

export function filterAndPaginateCompetencies(
  competencies: Competency[],
  {
    page,
    limit,
    search,
    category,
    company_id
  }: { page: number; limit: number; search?: string; category?: string; company_id?: string }
) {
  let filtered = competencies;

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(s));
  }
  if (category) {
    filtered = filtered.filter((c) => c.category === category);
  }
  if (company_id) {
    filtered = filtered.filter((c) => c.company_id === company_id);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  const pages = Math.max(1, Math.ceil(total / limit));

  return { data, total, pages };
}




