/**
 * Type Definitions for Skills Engine Frontend (JSDoc)
 */

/**
 * @typedef {'regular' | 'trainer'} EmployeeType
 */

/**
 * @typedef {Object} User
 * @property {string} user_id
 * @property {string} user_name
 * @property {string} company_id
 * @property {EmployeeType} employee_type
 * @property {string} [path_career]
 * @property {number} relevance_score
 */

/**
 * @typedef {Object} Competency
 * @property {string} competency_id
 * @property {string} competency_name
 * @property {string} [description]
 * @property {string} [parent_competency_id]
 */

/**
 * @typedef {Object} Skill
 * @property {string} skill_id
 * @property {string} skill_name
 * @property {string} [description]
 * @property {string} [parent_skill_id]
 */

/**
 * @typedef {Object} VerifiedSkill
 * @property {string} skill_id
 * @property {string} skill_name
 * @property {boolean} verified
 * @property {string} [lastUpdate]
 */

/**
 * @typedef {Object} UserCompetency
 * @property {string} user_id
 * @property {string} competency_id
 * @property {number} coverage_percentage
 * @property {'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'} [proficiency_level]
 * @property {VerifiedSkill[]} verifiedSkills
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} UserSkill
 * @property {string} user_id
 * @property {string} skill_id
 * @property {string} skill_name
 * @property {boolean} verified
 * @property {'assessment' | 'certification' | 'claim' | 'ai'} [source]
 * @property {string} [last_update]
 */

/**
 * @typedef {Object} SkillNode
 * @property {string} code
 * @property {string} label
 * @property {string} percent
 * @property {boolean} passed
 */

/**
 * @typedef {Object} CompetencyTree
 * @property {Object} l1
 * @property {string} l1.label
 * @property {string} l1.percent
 * @property {Object} l1.children
 */

/**
 * @typedef {Object} CompetencyCard
 * @property {string} id
 * @property {string} title
 * @property {number} percentage
 * @property {string} icon
 * @property {string} color
 * @property {string} description
 * @property {number} skillsTotal
 * @property {number} skillsMastered
 * @property {CompetencyTree} tree
 */

/**
 * @typedef {Object} GapAnalysis
 * @property {string} competency_id
 * @property {number} required_mgs_count
 * @property {number} verified_mgs_count
 * @property {number} missing_mgs_count
 * @property {Object<string, Array<{skill_id: string, skill_name: string}>>} missing_mgs
 * @property {number} coverage_percentage
 */

/**
 * @typedef {Object} UserProfile
 * @property {User} user
 * @property {UserCompetency[]} competencies
 * @property {UserSkill[]} skills
 * @property {Object<string, GapAnalysis>} [gap_analysis]
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [error]
 */

