// Mock data for Skills Engine development and testing

export interface MockCompetency {
  id: number;
  code: string;
  name: string;
  description: string;

  external_id?: string;
  external_source?: string;
 
  updated_at: string;
}

export interface MockSkill {
  id: number;
  code: string;
  name: string;
  description: string;

  external_id?: string;
 
  created_at: string;
  updated_at: string;
}

export interface MockUser {
  id: number;
  external_id: string;
  name: string;
  company_id:number;
}

export interface MockUserCompetency {
  id: number;
  user_id: number;
  competency_id: number;
  level: string;

  verification_source?: string;
 
  created_at: string;
  updated_at: string;
}

export interface MockUserSkill {
  id: number;
  user_id: number;
  skill_id: number;
 
  is_verified: boolean;
  
  verification_source?: string;
 
  created_at: string;
  updated_at: string;
}

export interface MockEvent {
  id: number;
  event_type: string;
  user_id: number;
  event_data: any;
  source?: string;
  status: string;
  processed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface MockCompetencySubCompetency {
  id: number;
  id_parent: number;
  id_child: number;
}

export interface MockSkillSubSkill {
  id: number;
  id_parent: number;
  id_child: number;
}

export interface MockCompetencySkill {
  id: number;
  competency_id: number;
  skill_id: number;
}

// Mock Competencies Data
export const mockCompetencies: MockCompetency[] = [
  {
    id: 1,
    code: 'SOFTWARE_DEVELOPMENT',
    name: 'Software Development',
    description: 'Core software development competencies including programming, design, and architecture',
    external_id: 'SFIA_SDEV',
    external_source: 'SFIA',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'FRONTEND_DEVELOPMENT',
    name: 'Frontend Development',
    description: 'User interface and user experience development skills',
    external_id: 'SFIA_FRONT',
    external_source: 'SFIA',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'BACKEND_DEVELOPMENT',
    name: 'Backend Development',
    description: 'Server-side development and API design skills',
    external_id: 'SFIA_BACK',
    external_source: 'SFIA',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    code: 'DATA_SCIENCE',
    name: 'Data Science',
    description: 'Data analysis, machine learning, and statistical modeling competencies',
    external_id: 'SFIA_DATA',
    external_source: 'SFIA',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    code: 'PROJECT_MANAGEMENT',
    name: 'Project Management',
    description: 'Project planning, execution, and team leadership skills',
    external_id: 'SFIA_PM',
    external_source: 'SFIA',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    code: 'MACHINE_LEARNING',
    name: 'Machine Learning',
    description: 'AI and machine learning competencies for data science',
    external_id: 'ML_COMP',
    external_source: 'CUSTOM',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    code: 'AGILE_MANAGEMENT',
    name: 'Agile Management',
    description: 'Agile project management and team leadership',
    external_id: 'AGILE_COMP',
    external_source: 'CUSTOM',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    code: 'DEVOPS',
    name: 'DevOps',
    description: 'Development operations and infrastructure management',
    external_id: 'DEVOPS_COMP',
    external_source: 'CUSTOM',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Skills Data - Comprehensive JavaScript Skill Hierarchy
export const mockSkills: MockSkill[] = [
  // Level 1 - Root Skills
  {
    id: 1,
    code: 'JAVASCRIPT',
    name: 'JavaScript',
    description: 'Programming language for web development',
    external_id: 'JS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'PYTHON',
    name: 'Python',
    description: 'Programming language for data science and web development',
    external_id: 'PYTHON_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'SQL',
    name: 'SQL',
    description: 'Structured Query Language for database management',
    external_id: 'SQL_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    code: 'AGILE_METHODOLOGY',
    name: 'Agile Methodology',
    description: 'Project management approach emphasizing iterative development',
    external_id: 'AGILE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    code: 'DOCKER',
    name: 'Docker',
    description: 'Containerization platform for application deployment',
    external_id: 'DOCKER_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Level 2 - JavaScript Fundamentals
  {
    id: 10,
    code: 'JS_CORE_FUNDAMENTALS',
    name: 'Core Fundamentals',
    description: 'JavaScript basics including variables, operators, and control structures',
    external_id: 'JS_CORE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 11,
    code: 'JS_FUNCTIONS',
    name: 'Functions',
    description: 'JavaScript functions including declarations, expressions, and arrow functions',
    external_id: 'JS_FUNCTIONS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 12,
    code: 'JS_DATA_STRUCTURES',
    name: 'Data Structures',
    description: 'Arrays, objects, and modern data structures in JavaScript',
    external_id: 'JS_DATA_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 13,
    code: 'JS_ASYNC',
    name: 'Asynchronous Programming',
    description: 'Callbacks, promises, async/await, and advanced async patterns',
    external_id: 'JS_ASYNC_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 14,
    code: 'JS_BROWSER_APIS',
    name: 'Browser APIs',
    description: 'DOM manipulation, Web APIs, and browser-specific functionality',
    external_id: 'JS_BROWSER_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 15,
    code: 'JS_MODERN',
    name: 'Modern JavaScript (ES6+)',
    description: 'ES6+ syntax, modules, and modern JavaScript features',
    external_id: 'JS_MODERN_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 16,
    code: 'JS_OOP',
    name: 'Object-Oriented Programming',
    description: 'Classes, inheritance, and design patterns in JavaScript',
    external_id: 'JS_OOP_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 17,
    code: 'JS_ERROR_HANDLING',
    name: 'Error Handling & Debugging',
    description: 'Error handling, debugging tools, and performance optimization',
    external_id: 'JS_ERROR_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 18,
    code: 'JS_TESTING',
    name: 'Testing',
    description: 'Unit testing, integration testing, and testing frameworks',
    external_id: 'JS_TESTING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 19,
    code: 'JS_PERFORMANCE',
    name: 'Performance Optimization',
    description: 'Code optimization, memory management, and browser performance',
    external_id: 'JS_PERFORMANCE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 20,
    code: 'JS_BUILD_TOOLS',
    name: 'Build Tools & Workflow',
    description: 'Package managers, build tools, and development workflow',
    external_id: 'JS_BUILD_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 21,
    code: 'JS_FRAMEWORKS',
    name: 'Frameworks & Libraries',
    description: 'React, Vue, Angular, and other JavaScript frameworks',
    external_id: 'JS_FRAMEWORKS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Level 3 - Specific Skills
  {
    id: 30,
    code: 'JS_VARIABLES',
    name: 'Variables & Data Types',
    description: 'Primitive types, type conversion, and variable scope',
    external_id: 'JS_VARIABLES_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 31,
    code: 'JS_OPERATORS',
    name: 'Operators',
    description: 'Arithmetic, comparison, and logical operators',
    external_id: 'JS_OPERATORS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 32,
    code: 'JS_CONTROL_STRUCTURES',
    name: 'Control Structures',
    description: 'Conditional logic, loops, and switch statements',
    external_id: 'JS_CONTROL_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 33,
    code: 'JS_FUNCTION_TYPES',
    name: 'Function Types',
    description: 'Function declarations, expressions, arrow functions, and IIFE',
    external_id: 'JS_FUNCTION_TYPES_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 34,
    code: 'JS_ADVANCED_FUNCTIONS',
    name: 'Advanced Function Concepts',
    description: 'Closures, higher-order functions, recursion, and currying',
    external_id: 'JS_ADVANCED_FUNCTIONS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 35,
    code: 'JS_ARRAYS',
    name: 'Arrays',
    description: 'Array methods, manipulation, and destructuring',
    external_id: 'JS_ARRAYS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 36,
    code: 'JS_OBJECTS',
    name: 'Objects',
    description: 'Object creation, prototypes, and classes',
    external_id: 'JS_OBJECTS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 37,
    code: 'JS_MODERN_DATA_STRUCTURES',
    name: 'Modern Data Structures',
    description: 'Map, Set, WeakMap, WeakSet, and Symbols',
    external_id: 'JS_MODERN_DATA_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 38,
    code: 'JS_CALLBACKS',
    name: 'Callback Patterns',
    description: 'Callbacks and error handling patterns',
    external_id: 'JS_CALLBACKS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 39,
    code: 'JS_PROMISES',
    name: 'Promises',
    description: 'Promise API, async/await, and error handling',
    external_id: 'JS_PROMISES_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 40,
    code: 'JS_ADVANCED_ASYNC',
    name: 'Advanced Async',
    description: 'Generators, iterators, and event loop understanding',
    external_id: 'JS_ADVANCED_ASYNC_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 41,
    code: 'JS_DOM_MANIPULATION',
    name: 'DOM Manipulation',
    description: 'Element selection, content modification, and event handling',
    external_id: 'JS_DOM_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 42,
    code: 'JS_WEB_APIS',
    name: 'Web APIs',
    description: 'Fetch API, localStorage, WebSockets, and Service Workers',
    external_id: 'JS_WEB_APIS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 43,
    code: 'JS_ES6_SYNTAX',
    name: 'ES6+ Syntax',
    description: 'Template literals, destructuring, spread/rest, and default parameters',
    external_id: 'JS_ES6_SYNTAX_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 44,
    code: 'JS_MODULES',
    name: 'Modules',
    description: 'ES6 modules, CommonJS, and module bundlers',
    external_id: 'JS_MODULES_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 45,
    code: 'JS_CLASSES',
    name: 'Classes & Inheritance',
    description: 'Class syntax, inheritance, and encapsulation',
    external_id: 'JS_CLASSES_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 46,
    code: 'JS_DESIGN_PATTERNS',
    name: 'Design Patterns',
    description: 'Creational, structural, and behavioral design patterns',
    external_id: 'JS_DESIGN_PATTERNS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 47,
    code: 'JS_ERROR_HANDLING',
    name: 'Error Handling',
    description: 'Try/catch/finally, error objects, and custom errors',
    external_id: 'JS_ERROR_HANDLING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 48,
    code: 'JS_DEBUGGING',
    name: 'Debugging Tools',
    description: 'Browser DevTools, logging strategies, and performance profiling',
    external_id: 'JS_DEBUGGING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 49,
    code: 'JS_UNIT_TESTING',
    name: 'Unit Testing',
    description: 'Testing individual functions with Jest, Mocha',
    external_id: 'JS_UNIT_TESTING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 50,
    code: 'JS_INTEGRATION_TESTING',
    name: 'Integration Testing',
    description: 'Testing component interactions',
    external_id: 'JS_INTEGRATION_TESTING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 51,
    code: 'JS_E2E_TESTING',
    name: 'E2E Testing',
    description: 'Cypress, Playwright for full app testing',
    external_id: 'JS_E2E_TESTING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 52,
    code: 'JS_ALGORITHM_EFFICIENCY',
    name: 'Algorithm Efficiency',
    description: 'Big O notation and optimization techniques',
    external_id: 'JS_ALGORITHM_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 53,
    code: 'JS_MEMORY_MANAGEMENT',
    name: 'Memory Management',
    description: 'Garbage collection and memory leaks prevention',
    external_id: 'JS_MEMORY_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 54,
    code: 'JS_DEBOUNCING_THROTTLING',
    name: 'Debouncing & Throttling',
    description: 'Limiting function execution for performance',
    external_id: 'JS_DEBOUNCING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 55,
    code: 'JS_RENDERING_OPTIMIZATION',
    name: 'Rendering Optimization',
    description: 'Reflow, repaint, and layout thrashing prevention',
    external_id: 'JS_RENDERING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 56,
    code: 'JS_LAZY_LOADING',
    name: 'Lazy Loading',
    description: 'Code splitting and dynamic imports',
    external_id: 'JS_LAZY_LOADING_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 57,
    code: 'JS_WEB_WORKERS',
    name: 'Web Workers',
    description: 'Offloading tasks to background threads',
    external_id: 'JS_WEB_WORKERS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 58,
    code: 'JS_PACKAGE_MANAGERS',
    name: 'Package Managers',
    description: 'npm, yarn, and pnpm for dependency management',
    external_id: 'JS_PACKAGE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 59,
    code: 'JS_WEBPACK',
    name: 'Webpack',
    description: 'Module bundler and build tool',
    external_id: 'JS_WEBPACK_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 60,
    code: 'JS_VITE',
    name: 'Vite',
    description: 'Fast build tool for modern web projects',
    external_id: 'JS_VITE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 61,
    code: 'JS_ROLLUP',
    name: 'Rollup',
    description: 'Module bundler for libraries',
    external_id: 'JS_ROLLUP_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 62,
    code: 'JS_BABEL',
    name: 'Babel',
    description: 'JavaScript transpiler for older browsers',
    external_id: 'JS_BABEL_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 63,
    code: 'JS_TYPESCRIPT',
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    external_id: 'JS_TYPESCRIPT_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 64,
    code: 'JS_POSTCSS',
    name: 'PostCSS',
    description: 'CSS transformation tool',
    external_id: 'JS_POSTCSS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 65,
    code: 'JS_REACT',
    name: 'React',
    description: 'Component-based UI library',
    external_id: 'JS_REACT_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 66,
    code: 'JS_VUE',
    name: 'Vue',
    description: 'Progressive JavaScript framework',
    external_id: 'JS_VUE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 67,
    code: 'JS_ANGULAR',
    name: 'Angular',
    description: 'Full-featured framework',
    external_id: 'JS_ANGULAR_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 68,
    code: 'JS_SVELTE',
    name: 'Svelte',
    description: 'Compile-time framework',
    external_id: 'JS_SVELTE_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 69,
    code: 'JS_REDUX',
    name: 'Redux',
    description: 'Predictable state container',
    external_id: 'JS_REDUX_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 70,
    code: 'JS_MOBX',
    name: 'MobX',
    description: 'Reactive state management',
    external_id: 'JS_MOBX_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 71,
    code: 'JS_ZUSTAND',
    name: 'Zustand',
    description: 'Lightweight state management',
    external_id: 'JS_ZUSTAND_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 72,
    code: 'JS_NODEJS',
    name: 'Node.js',
    description: 'JavaScript runtime for server-side',
    external_id: 'JS_NODEJS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 73,
    code: 'JS_EXPRESS',
    name: 'Express',
    description: 'Web application framework',
    external_id: 'JS_EXPRESS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 74,
    code: 'JS_NEXTJS',
    name: 'Next.js',
    description: 'React framework with SSR',
    external_id: 'JS_NEXTJS_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 75,
    code: 'JS_GRAPHQL',
    name: 'GraphQL',
    description: 'Query language for APIs',
    external_id: 'JS_GRAPHQL_SKILL',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Users Data
export const mockUsers: MockUser[] = [
  {
    id: 1,
    external_id: 'user_001',
    name: 'John Doe',
    company_id: 1
  },
  {
    id: 2,
    external_id: 'user_002',
    name: 'Jane Smith',
    company_id: 1
  },
  {
    id: 3,
    external_id: 'user_003',
    name: 'Mike Johnson',
    company_id: 2
  }
];

// Mock User Competencies Data
export const mockUserCompetencies: MockUserCompetency[] = [
  {
    id: 1,
    user_id: 1,
    competency_id: 1,
    level: 'Advanced',
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    competency_id: 2,
    level: 'Expert',
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    user_id: 2,
    competency_id: 4,
    level: 'Intermediate',
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T09:45:00Z'
  },
  {
    id: 4,
    user_id: 3,
    competency_id: 5,
    level: 'Advanced',
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-25T16:20:00Z'
  }
];

// Mock User Skills Data
export const mockUserSkills: MockUserSkill[] = [
  {
    id: 1,
    user_id: 1,
    skill_id: 1,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    skill_id: 2,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    skill_id: 3,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T11:00:00Z'
  },
  {
    id: 4,
    user_id: 2,
    skill_id: 4,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T09:45:00Z'
  },
  {
    id: 5,
    user_id: 2,
    skill_id: 5,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T13:30:00Z'
  },
  {
    id: 6,
    user_id: 3,
    skill_id: 6,
    is_verified: true,
    verification_source: 'assessment',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-25T16:20:00Z'
  }
];

// Mock Events Data
export const mockEvents: MockEvent[] = [
  {
    id: 1,
    event_type: 'user-created',
    user_id: 1,
    event_data: { name: 'John Doe', email: 'john.doe@company.com', role: 'Software Developer' },
    source: 'directory-service',
    status: 'processed',
    processed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    event_type: 'assessment-completed',
    user_id: 1,
    event_data: { assessment_id: 123, results: { javascript: 95, react: 90 } },
    source: 'assessment-service',
    status: 'processed',
    processed_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    event_type: 'skill-verified',
    user_id: 1,
    event_data: { skill_id: 1, verification_data: { source: 'assessment', score: 95 } },
    source: 'assessment-service',
    status: 'processed',
    processed_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z'
  }
];

// Mock Competency-Skill Relationships
// This table represents that a competency can include multiple skills
// and a skill can be part of multiple competencies
export const mockCompetencySkills: MockCompetencySkill[] = [
  // Software Development competency includes multiple skills
  { id: 1, competency_id: 1, skill_id: 1 }, // Software Development -> JavaScript
  { id: 2, competency_id: 1, skill_id: 2 }, // Software Development -> React
  { id: 3, competency_id: 1, skill_id: 3 }, // Software Development -> Node.js
  { id: 4, competency_id: 1, skill_id: 4 }, // Software Development -> Python
  
  // Frontend Development competency (subset of Software Development)
  { id: 5, competency_id: 2, skill_id: 1 }, // Frontend Development -> JavaScript
  { id: 6, competency_id: 2, skill_id: 2 }, // Frontend Development -> React
  
  // Backend Development competency (subset of Software Development)
  { id: 7, competency_id: 3, skill_id: 1 }, // Backend Development -> JavaScript
  { id: 8, competency_id: 3, skill_id: 3 }, // Backend Development -> Node.js
  { id: 9, competency_id: 3, skill_id: 4 }, // Backend Development -> Python
  { id: 10, competency_id: 3, skill_id: 5 }, // Backend Development -> SQL
  
  // Data Science competency includes data-related skills
  { id: 11, competency_id: 4, skill_id: 4 }, // Data Science -> Python
  { id: 12, competency_id: 4, skill_id: 5 }, // Data Science -> SQL
  { id: 13, competency_id: 4, skill_id: 7 }, // Data Science -> Machine Learning
  
  // Project Management competency includes management skills
  { id: 14, competency_id: 5, skill_id: 6 }, // Project Management -> Agile Methodology
  { id: 15, competency_id: 5, skill_id: 8 }, // Project Management -> Agile Management
  { id: 16, competency_id: 5, skill_id: 9 },  // Project Management -> Scrum
  
  // Machine Learning competency (nested under Data Science)
  { id: 17, competency_id: 6, skill_id: 4 }, // Machine Learning -> Python
  { id: 18, competency_id: 6, skill_id: 5 }, // Machine Learning -> SQL
  { id: 19, competency_id: 6, skill_id: 7 }, // Machine Learning -> Machine Learning
  { id: 20, competency_id: 6, skill_id: 12 }, // Machine Learning -> TensorFlow
  
  // Agile Management competency (nested under Project Management)
  { id: 21, competency_id: 7, skill_id: 6 }, // Agile Management -> Agile Methodology
  { id: 22, competency_id: 7, skill_id: 8 }, // Agile Management -> Agile Management
  { id: 23, competency_id: 7, skill_id: 9 }, // Agile Management -> Scrum
  
  // DevOps competency (nested under Software Development)
  { id: 24, competency_id: 8, skill_id: 1 }, // DevOps -> JavaScript
  { id: 25, competency_id: 8, skill_id: 3 }, // DevOps -> Node.js
  { id: 26, competency_id: 8, skill_id: 10 }, // DevOps -> Docker
  { id: 27, competency_id: 8, skill_id: 11 }  // DevOps -> Kubernetes
];

// Mock Competency Sub-Competency Relationships (Parent-Child)
// This represents that a competency can include nested competencies
export const mockCompetencySubCompetencies: MockCompetencySubCompetency[] = [
  // Software Development is the parent competency that includes:
  { id: 1, id_parent: 1, id_child: 2 }, // Software Development -> Frontend Development
  { id: 2, id_parent: 1, id_child: 3 }, // Software Development -> Backend Development
  { id: 3, id_parent: 1, id_child: 8 }, // Software Development -> DevOps
  
  // Data Science can include nested competencies:
  { id: 4, id_parent: 4, id_child: 6 }, // Data Science -> Machine Learning
  
  // Project Management can include nested competencies:
  { id: 5, id_parent: 5, id_child: 7 }, // Project Management -> Agile Management
  
  // Machine Learning can have its own nested competencies (if we had more):
  // This shows how deep nesting can work
];

// Mock Skill Sub-Skill Relationships (Parent-Child)
// This represents the comprehensive JavaScript skill hierarchy
export const mockSkillSubSkills: MockSkillSubSkill[] = [
  // JavaScript -> Level 2 Skills (Fundamentals)
  { id: 1, id_parent: 1, id_child: 10 }, // JavaScript -> Core Fundamentals
  { id: 2, id_parent: 1, id_child: 11 }, // JavaScript -> Functions
  { id: 3, id_parent: 1, id_child: 12 }, // JavaScript -> Data Structures
  { id: 4, id_parent: 1, id_child: 13 }, // JavaScript -> Asynchronous Programming
  { id: 5, id_parent: 1, id_child: 14 }, // JavaScript -> Browser APIs
  { id: 6, id_parent: 1, id_child: 15 }, // JavaScript -> Modern JavaScript (ES6+)
  { id: 7, id_parent: 1, id_child: 16 }, // JavaScript -> Object-Oriented Programming
  { id: 8, id_parent: 1, id_child: 17 }, // JavaScript -> Error Handling & Debugging
  { id: 9, id_parent: 1, id_child: 18 }, // JavaScript -> Testing
  { id: 10, id_parent: 1, id_child: 19 }, // JavaScript -> Performance Optimization
  { id: 11, id_parent: 1, id_child: 20 }, // JavaScript -> Build Tools & Workflow
  { id: 12, id_parent: 1, id_child: 21 }, // JavaScript -> Frameworks & Libraries

  // Core Fundamentals -> Level 3 Skills
  { id: 13, id_parent: 10, id_child: 30 }, // Core Fundamentals -> Variables & Data Types
  { id: 14, id_parent: 10, id_child: 31 }, // Core Fundamentals -> Operators
  { id: 15, id_parent: 10, id_child: 32 }, // Core Fundamentals -> Control Structures

  // Functions -> Level 3 Skills
  { id: 16, id_parent: 11, id_child: 33 }, // Functions -> Function Types
  { id: 17, id_parent: 11, id_child: 34 }, // Functions -> Advanced Function Concepts

  // Data Structures -> Level 3 Skills
  { id: 18, id_parent: 12, id_child: 35 }, // Data Structures -> Arrays
  { id: 19, id_parent: 12, id_child: 36 }, // Data Structures -> Objects
  { id: 20, id_parent: 12, id_child: 37 }, // Data Structures -> Modern Data Structures

  // Asynchronous Programming -> Level 3 Skills
  { id: 21, id_parent: 13, id_child: 38 }, // Asynchronous Programming -> Callback Patterns
  { id: 22, id_parent: 13, id_child: 39 }, // Asynchronous Programming -> Promises
  { id: 23, id_parent: 13, id_child: 40 }, // Asynchronous Programming -> Advanced Async

  // Browser APIs -> Level 3 Skills
  { id: 24, id_parent: 14, id_child: 41 }, // Browser APIs -> DOM Manipulation
  { id: 25, id_parent: 14, id_child: 42 }, // Browser APIs -> Web APIs

  // Modern JavaScript -> Level 3 Skills
  { id: 26, id_parent: 15, id_child: 43 }, // Modern JavaScript -> ES6+ Syntax
  { id: 27, id_parent: 15, id_child: 44 }, // Modern JavaScript -> Modules

  // Object-Oriented Programming -> Level 3 Skills
  { id: 28, id_parent: 16, id_child: 45 }, // OOP -> Classes & Inheritance
  { id: 29, id_parent: 16, id_child: 46 }, // OOP -> Design Patterns

  // Error Handling & Debugging -> Level 3 Skills
  { id: 30, id_parent: 17, id_child: 47 }, // Error Handling -> Error Handling
  { id: 31, id_parent: 17, id_child: 48 }, // Error Handling -> Debugging Tools

  // Testing -> Level 3 Skills
  { id: 32, id_parent: 18, id_child: 49 }, // Testing -> Unit Testing
  { id: 33, id_parent: 18, id_child: 50 }, // Testing -> Integration Testing
  { id: 34, id_parent: 18, id_child: 51 }, // Testing -> E2E Testing

  // Performance Optimization -> Level 3 Skills
  { id: 35, id_parent: 19, id_child: 52 }, // Performance -> Algorithm Efficiency
  { id: 36, id_parent: 19, id_child: 53 }, // Performance -> Memory Management
  { id: 37, id_parent: 19, id_child: 54 }, // Performance -> Debouncing & Throttling
  { id: 38, id_parent: 19, id_child: 55 }, // Performance -> Rendering Optimization
  { id: 39, id_parent: 19, id_child: 56 }, // Performance -> Lazy Loading
  { id: 40, id_parent: 19, id_child: 57 }, // Performance -> Web Workers

  // Build Tools & Workflow -> Level 3 Skills
  { id: 41, id_parent: 20, id_child: 58 }, // Build Tools -> Package Managers
  { id: 42, id_parent: 20, id_child: 59 }, // Build Tools -> Webpack
  { id: 43, id_parent: 20, id_child: 60 }, // Build Tools -> Vite
  { id: 44, id_parent: 20, id_child: 61 }, // Build Tools -> Rollup
  { id: 45, id_parent: 20, id_child: 62 }, // Build Tools -> Babel
  { id: 46, id_parent: 20, id_child: 63 }, // Build Tools -> TypeScript
  { id: 47, id_parent: 20, id_child: 64 }, // Build Tools -> PostCSS

  // Frameworks & Libraries -> Level 3 Skills
  { id: 48, id_parent: 21, id_child: 65 }, // Frameworks -> React
  { id: 49, id_parent: 21, id_child: 66 }, // Frameworks -> Vue
  { id: 50, id_parent: 21, id_child: 67 }, // Frameworks -> Angular
  { id: 51, id_parent: 21, id_child: 68 }, // Frameworks -> Svelte
  { id: 52, id_parent: 21, id_child: 69 }, // Frameworks -> Redux
  { id: 53, id_parent: 21, id_child: 70 }, // Frameworks -> MobX
  { id: 54, id_parent: 21, id_child: 71 }, // Frameworks -> Zustand
  { id: 55, id_parent: 21, id_child: 72 }, // Frameworks -> Node.js
  { id: 56, id_parent: 21, id_child: 73 }, // Frameworks -> Express
  { id: 57, id_parent: 21, id_child: 74 }, // Frameworks -> Next.js
  { id: 58, id_parent: 21, id_child: 75 }, // Frameworks -> GraphQL

  // Other root skills relationships
  { id: 59, id_parent: 2, id_child: 1 }, // Python -> JavaScript (for web development)
  { id: 60, id_parent: 3, id_child: 2 }, // SQL -> Python (for data analysis)
  { id: 61, id_parent: 4, id_child: 1 }, // Agile Methodology -> JavaScript (for development)
  { id: 62, id_parent: 5, id_child: 1 }  // Docker -> JavaScript (for containerization)
];

// Helper functions for mock data operations
export class MockDataService {
  static getCompetencies(): MockCompetency[] {
    return mockCompetencies;
  }

  static getCompetencyById(id: number): MockCompetency | undefined {
    return mockCompetencies.find(c => c.id === id);
  }

  static getSkills(): MockSkill[] {
    return mockSkills;
  }

  static getSkillById(id: number): MockSkill | undefined {
    return mockSkills.find(s => s.id === id);
  }

  static getUsers(): MockUser[] {
    return mockUsers;
  }

  static getUserById(id: number): MockUser | undefined {
    return mockUsers.find(u => u.id === id);
  }

  static getUserCompetencies(userId: number): MockUserCompetency[] {
    return mockUserCompetencies.filter(uc => uc.user_id === userId);
  }

  static getUserSkills(userId: number): MockUserSkill[] {
    return mockUserSkills.filter(us => us.user_id === userId);
  }

  static getEvents(userId?: number): MockEvent[] {
    if (userId) {
      return mockEvents.filter(e => e.user_id === userId);
    }
    return mockEvents;
  }

  static getCompetencySkills(competencyId: number): any[] {
    return mockCompetencySkills.filter(cs => cs.competency_id === competencyId);
  }

  static getSkillsForCompetency(competencyId: number): MockSkill[] {
    const competencySkillIds = mockCompetencySkills
      .filter(cs => cs.competency_id === competencyId)
      .map(cs => cs.skill_id);
    
    return mockSkills.filter(skill => competencySkillIds.includes(skill.id));
  }

  static getCompetenciesForSkill(skillId: number): MockCompetency[] {
    const skillCompetencyIds = mockCompetencySkills
      .filter(cs => cs.skill_id === skillId)
      .map(cs => cs.competency_id);
    
    return mockCompetencies.filter(competency => skillCompetencyIds.includes(competency.id));
  }

  static getCompetencyTree(competencyId: number): any {
    const competency = mockCompetencies.find(c => c.id === competencyId);
    if (!competency) return null;

    // Get direct child competencies
    const childCompetencies = mockCompetencySubCompetencies
      .filter(csc => csc.id_parent === competencyId)
      .map(csc => {
        const child = mockCompetencies.find(c => c.id === csc.id_child);
        return child ? this.getCompetencyTree(child.id) : null;
      })
      .filter(Boolean);

    // Get skills for this competency
    const skills = this.getSkillsForCompetency(competencyId);

    return {
      ...competency,
      children: childCompetencies,
      skills: skills,
      total_children: childCompetencies.length,
      total_skills: skills.length
    };
  }

  static getCompetencySubCompetencies(parentId: number): any[] {
    return mockCompetencySubCompetencies.filter(csc => csc.id_parent === parentId);
  }

  static getSkillSubSkills(parentId: number): any[] {
    return mockSkillSubSkills.filter(sss => sss.id_parent === parentId);
  }

  static getSkillTree(skillId: number): any {
    const skill = mockSkills.find(s => s.id === skillId);
    if (!skill) return null;

    // Get direct child skills
    const childSkills = mockSkillSubSkills
      .filter(sss => sss.id_parent === skillId)
      .map(sss => {
        const child = mockSkills.find(s => s.id === sss.id_child);
        return child ? this.getSkillTree(child.id) : null;
      })
      .filter(Boolean);

    // Get parent skills
    const parentSkills = mockSkillSubSkills
      .filter(sss => sss.id_child === skillId)
      .map(sss => {
        const parent = mockSkills.find(s => s.id === sss.id_parent);
        return parent ? this.getSkillTree(parent.id) : null;
      })
      .filter(Boolean);

    return {
      ...skill,
      children: childSkills,
      parents: parentSkills,
      total_children: childSkills.length,
      total_parents: parentSkills.length,
      level: this.calculateSkillLevel(skillId)
    };
  }

  static calculateSkillLevel(skillId: number): number {
    // Calculate skill level based on hierarchy depth
    const parents = mockSkillSubSkills.filter(sss => sss.id_child === skillId);
    if (parents.length === 0) return 1; // Root level
    
    const maxParentLevel = Math.max(...parents.map(p => this.calculateSkillLevel(p.id_parent)));
    return maxParentLevel + 1;
  }

  static getSkillGaps(userId: number): any[] {
    // Mock gap analysis - in real implementation, this would calculate actual gaps
    return [
      {
        skill_id: 3,
        skill_name: 'Node.js',
        competency_id: 1,
        competency_name: 'Software Development',
        required_level: 'Advanced',
        current_level: 'Intermediate',
        priority: 'High',
        recommendations: [
          {
            type: 'course',
            title: 'Advanced Node.js Development',
            url: 'https://learning.company.com/nodejs-advanced'
          }
        ]
      }
    ];
  }
}
