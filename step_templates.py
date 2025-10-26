"""
Step Templates for Automated AI-Integrated Full-Stack Development Workflow
Provides structured templates for each of the 11 steps in the development workflow
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class Priority(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ConsensusStatus(Enum):
    AGREE = "agree"
    DISAGREE = "disagree"
    CONDITIONAL = "conditional"
    PENDING = "pending"

@dataclass
class Role:
    name: str
    focus: str
    validates: str
    challenges: str
    participation_level: str = "primary"  # primary, secondary, conditional

@dataclass
class Topic:
    priority: Priority
    description: str
    context: Optional[str] = None

@dataclass
class CompletionCriterion:
    description: str
    validation_method: str
    required: bool = True

@dataclass
class OutputField:
    name: str
    description: str
    required: bool = True
    data_type: str = "string"

class StepTemplate:
    """Base template for all workflow steps"""
    
    def __init__(self, step_id: int, name: str, dependencies: List[int]):
        self.step_id = step_id
        self.name = name
        self.dependencies = dependencies
        self.roles = []
        self.topics = []
        self.completion_criteria = []
        self.output_structure = []
        
    def add_role(self, role: Role):
        """Add a role to this step"""
        self.roles.append(role)
        
    def add_topic(self, topic: Topic):
        """Add a topic to this step"""
        self.topics.append(topic)
        
    def add_completion_criterion(self, criterion: CompletionCriterion):
        """Add a completion criterion"""
        self.completion_criteria.append(criterion)
        
    def add_output_field(self, field: OutputField):
        """Add an output field"""
        self.output_structure.append(field)

# ============================================================================
# STEP 1: PROJECT DEFINITION
# ============================================================================

class Step1ProjectDefinition(StepTemplate):
    def __init__(self):
        super().__init__(1, "Project Definition", [])
        
        # Define roles
        self.add_role(Role(
            name="Product_Strategist",
            focus="Business value, market fit, user needs",
            validates="Problem statement clarity, success metrics feasibility",
            challenges="Vague goals, unmeasurable KPIs, missing stakeholder analysis"
        ))
        
        self.add_role(Role(
            name="Technical_Architect", 
            focus="Technical feasibility, constraints, scalability implications",
            validates="Realistic scope given constraints, technical risk assessment",
            challenges="Over-ambitious scope, unclear technical boundaries"
        ))
        
        self.add_role(Role(
            name="UX_Researcher",
            focus="User pain points, behavioral insights, accessibility needs",
            validates="User-centric problem framing, inclusive design considerations",
            challenges="Assumptions about users, lack of user research validation"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Problem statement and value proposition"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Target users and stakeholder ecosystem"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Vision, mission, and long-term goals"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Success metrics and KPIs with baselines"
        ))
        
        self.add_topic(Topic(
            priority=Priority.MEDIUM,
            description="Constraints: budget, technology, timeline, compliance"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="All roles agree on problem statement clarity",
            validation_method="consensus_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Success metrics are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
            validation_method="smart_metrics_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="User personas and stakeholders explicitly defined",
            validation_method="stakeholder_definition_check"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="problem_statement",
            description="Clear, concise problem statement",
            data_type="string"
        ))
        
        self.add_output_field(OutputField(
            name="value_proposition",
            description="Unique value proposition and competitive advantage",
            data_type="string"
        ))
        
        self.add_output_field(OutputField(
            name="target_users_and_stakeholders",
            description="Detailed user personas and stakeholder analysis",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="vision_and_mission",
            description="Project vision, mission, and long-term goals",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="success_metrics_kpis",
            description="SMART success metrics and KPIs with baselines",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="constraints_and_mitigations",
            description="Project constraints and mitigation strategies",
            data_type="object"
        ))

# ============================================================================
# STEP 2: ROADMAP & MILESTONES
# ============================================================================

class Step2RoadmapMilestones(StepTemplate):
    def __init__(self):
        super().__init__(2, "Roadmap & Milestones", [1])
        
        # Define roles
        self.add_role(Role(
            name="Product_Manager",
            focus="Feature prioritization, user value delivery, release strategy",
            validates="MVP scope, phased rollout logic, business value sequencing",
            challenges="Feature creep, unrealistic timelines, poor prioritization"
        ))
        
        self.add_role(Role(
            name="Technical_Lead",
            focus="Technical dependencies, architectural prerequisites, dev effort",
            validates="Buildability sequence, infrastructure readiness, technical debt",
            challenges="Missing foundational work, underestimated complexity"
        ))
        
        self.add_role(Role(
            name="Risk_Manager",
            focus="Schedule risks, technical blockers, dependency chains",
            validates="Risk mitigation plans, contingency buffers, dependency mapping",
            challenges="Undocumented risks, optimistic scheduling, no fallback plans"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="MVP feature set and scope boundaries"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Feature prioritization: value vs effort matrix"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Phased roadmap: MVP → Phase 2 → Scalability → Optimization"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Milestone definitions with dependencies and acceptance criteria"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Risk identification and mitigation strategies"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="MVP clearly separated from nice-to-haves",
            validation_method="mvp_scope_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="All milestones have dependencies mapped",
            validation_method="dependency_mapping_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Risk tags assigned with severity and mitigation plans",
            validation_method="risk_assessment_check"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="mvp_feature_list",
            description="Prioritized list of MVP features",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="prioritized_backlog",
            description="Complete prioritized feature backlog",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="phased_roadmap",
            description="Multi-phase development roadmap",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="milestone_definitions",
            description="Detailed milestone definitions with acceptance criteria",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="dependency_graph",
            description="Feature and technical dependency mapping",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="risk_register",
            description="Comprehensive risk register with mitigation strategies",
            data_type="array"
        ))

# ============================================================================
# STEP 3: FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS
# ============================================================================

class Step3Requirements(StepTemplate):
    def __init__(self):
        super().__init__(3, "Functional & Non-Functional Requirements", [1, 2])
        
        # Define roles
        self.add_role(Role(
            name="Business_Analyst",
            focus="User stories, acceptance criteria, business logic workflows",
            validates="Completeness of functional requirements, traceability to Step 1 goals",
            challenges="Ambiguous requirements, missing edge cases, unclear workflows"
        ))
        
        self.add_role(Role(
            name="QA_Engineer",
            focus="Testability, acceptance criteria specificity, quality attributes",
            validates="Measurable requirements, clear pass/fail criteria, test coverage",
            challenges="Untestable requirements, vague acceptance criteria"
        ))
        
        self.add_role(Role(
            name="Systems_Engineer",
            focus="Non-functional requirements: performance, scalability, reliability, security",
            validates="SLOs, capacity planning, compliance requirements, security posture",
            challenges="Missing NFRs, unrealistic performance targets, security gaps"
        ))
        
        self.add_role(Role(
            name="AI_Specialist",
            focus="AI-related capabilities, data requirements, model constraints",
            validates="AI feasibility, data availability, ethical considerations",
            challenges="Unclear AI requirements, missing data sources, bias risks",
            participation_level="conditional"  # Only if AI features identified
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="User stories with acceptance criteria (Given/When/Then)"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Business logic and workflow definitions"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Non-functional requirements: scalability, reliability, performance SLOs"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Security requirements and compliance mandates"
        ))
        
        self.add_topic(Topic(
            priority=Priority.MEDIUM,
            description="AI-related capabilities and data needs (if applicable)"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="All user stories follow standard format with acceptance criteria",
            validation_method="user_story_format_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="NFRs include measurable SLOs (e.g., 99.5% uptime, <200ms p95 latency)",
            validation_method="slo_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Security and compliance requirements explicitly documented",
            validation_method="security_requirements_check"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="functional_requirements_user_stories",
            description="Complete set of user stories with acceptance criteria",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="business_logic_workflows",
            description="Business logic and workflow definitions",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="nonfunctional_requirements",
            description="Non-functional requirements with measurable SLOs",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="security_compliance_requirements",
            description="Security and compliance requirements",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="ai_capabilities_requirements",
            description="AI-related capabilities and requirements (if applicable)",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="requirements_traceability_matrix",
            description="Requirements traceability matrix linking to goals and milestones",
            data_type="object"
        ))

# ============================================================================
# STEP 4: AI INTEGRATION PLAN
# ============================================================================

class Step4AIIntegration(StepTemplate):
    def __init__(self):
        super().__init__(4, "AI Integration Plan", [3])
        
        # Define roles
        self.add_role(Role(
            name="ML_Engineer",
            focus="Model selection, training pipelines, inference architecture",
            validates="Model feasibility, data requirements, performance metrics",
            challenges="Unrealistic model expectations, insufficient data, latency issues"
        ))
        
        self.add_role(Role(
            name="Data_Engineer",
            focus="Data pipelines, ETL processes, data quality, storage",
            validates="Data availability, pipeline scalability, data governance",
            challenges="Missing data sources, poor data quality, GDPR/privacy gaps"
        ))
        
        self.add_role(Role(
            name="Backend_Architect",
            focus="API design, service integration, async processing, scalability",
            validates="Clean integration points, decoupling, fault tolerance",
            challenges="Tight coupling, synchronous blocking calls, no fallback mechanisms"
        ))
        
        self.add_role(Role(
            name="Ethics_Officer",
            focus="Bias mitigation, fairness, transparency, privacy, compliance",
            validates="Ethical AI practices, explainability, human oversight",
            challenges="Unaddressed bias risks, lack of transparency, privacy violations"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="AI use cases and value-add scenarios"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Model selection: pretrained, fine-tuned, or custom"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Data pipelines: sources, ETL, quality, storage"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Training and inference strategy: offline/online, retraining cadence"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Integration points with frontend, backend, and database"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Data governance: PII handling, anonymization, bias mitigation"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="AI use cases clearly defined with expected outcomes",
            validation_method="ai_use_case_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Model lifecycle documented: training, evaluation, deployment, monitoring",
            validation_method="model_lifecycle_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Data flow diagrams show end-to-end pipelines",
            validation_method="data_flow_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="ai_use_cases",
            description="AI use cases and value-add scenarios",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="model_selection_strategy",
            description="Model selection strategy and rationale",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="data_pipelines_and_sources",
            description="Data pipeline architecture and data sources",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="training_inference_strategy",
            description="Training and inference strategy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="integration_architecture",
            description="AI integration architecture and API design",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="data_governance_framework",
            description="Data governance and ethical AI framework",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="evaluation_metrics",
            description="AI model evaluation metrics and monitoring",
            data_type="object"
        ))

# ============================================================================
# STEP 5: UX/UI & USER FLOW DESIGN
# ============================================================================

class Step5UXUIDesign(StepTemplate):
    def __init__(self):
        super().__init__(5, "UX/UI & User Flow Design", [3])
        
        # Define roles
        self.add_role(Role(
            name="UX_Designer",
            focus="User journeys, information architecture, task flows, usability",
            validates="User-centered design, intuitive navigation, task completion paths",
            challenges="Confusing flows, poor IA, missing user research validation"
        ))
        
        self.add_role(Role(
            name="UI_Designer",
            focus="Visual design, design system, branding, accessibility",
            validates="Visual consistency, WCAG compliance, responsive design",
            challenges="Inconsistent styling, accessibility gaps, poor mobile experience"
        ))
        
        self.add_role(Role(
            name="Frontend_Developer",
            focus="Implementability, component reusability, performance implications",
            validates="Feasible interactions, efficient rendering, maintainable code",
            challenges="Unrealistic animations, over-complex components, performance bottlenecks"
        ))
        
        self.add_role(Role(
            name="Accessibility_Specialist",
            focus="WCAG 2.1 AA/AAA compliance, assistive technology support, inclusive design",
            validates="Keyboard navigation, screen reader compatibility, color contrast",
            challenges="Inaccessible interactions, poor semantic HTML, missing ARIA"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Information architecture and site structure"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="User journeys and task flows for key scenarios"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Wireframes and mockups for primary screens"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Design system: colors, typography, spacing, components"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Accessibility compliance: WCAG 2.1 AA minimum"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="User flows mapped for all critical user stories from Step 3",
            validation_method="user_flow_mapping_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Wireframes approved with annotations for interactions",
            validation_method="wireframe_approval_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Design system documented with component library",
            validation_method="design_system_documentation_check"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="information_architecture",
            description="Information architecture and site structure",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="user_journeys_task_flows",
            description="User journeys and task flows",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="wireframes_mockups",
            description="Wireframes and mockups for primary screens",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="design_system_tokens",
            description="Design system tokens and component library",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="accessibility_checklist",
            description="Accessibility compliance checklist and remediation plan",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="responsive_design_specs",
            description="Responsive design specifications for mobile, tablet, desktop",
            data_type="object"
        ))

# ============================================================================
# STEP 6: DEVELOPMENT PROCESS
# ============================================================================

class Step6DevelopmentProcess(StepTemplate):
    def __init__(self):
        super().__init__(6, "Development Process", [1, 2, 3, 4, 5])
        
        # Define roles
        self.add_role(Role(
            name="Frontend_Lead",
            focus="Framework selection, component architecture, state management, styling",
            validates="Scalable frontend patterns, testability, performance optimization",
            challenges="Poor component design, state management complexity, slow builds"
        ))
        
        self.add_role(Role(
            name="Backend_Lead",
            focus="Framework selection, API design, service architecture, auth, observability",
            validates="RESTful/GraphQL best practices, security, monitoring, TDD readiness",
            challenges="Monolithic design issues, API inconsistencies, auth vulnerabilities"
        ))
        
        self.add_role(Role(
            name="Database_Architect",
            focus="Database selection, schema design, indexing, migrations, performance",
            validates="Normalized schema, query optimization, backup/replication strategy",
            challenges="Poor schema design, missing indexes, no migration strategy"
        ))
        
        self.add_role(Role(
            name="DevOps_Engineer",
            focus="CI/CD pipelines, branching strategy, environment parity, IaC",
            validates="Automated deployments, environment consistency, rollback procedures",
            challenges="Manual deployments, environment drift, no rollback plan"
        ))
        
        self.add_role(Role(
            name="Security_Engineer",
            focus="Secure coding practices, auth/authz, secrets management, vulnerability scanning",
            validates="OWASP compliance, dependency scanning, secure defaults",
            challenges="Security misconfigurations, hardcoded secrets, vulnerable dependencies"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Frontend: framework, architecture, state management, testing"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Backend: framework, service structure, API contracts, auth, testing, TDD"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Database: type selection, schema design, migrations, indexing, security"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Branching strategy: Git flow, trunk-based, feature branches"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="CI/CD pipeline: build, test, deploy automation"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="Framework selections justified with ADRs",
            validation_method="adr_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="TDD workflow defined: red-green-refactor cycle",
            validation_method="tdd_workflow_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="CI/CD pipeline stages documented with quality gates",
            validation_method="cicd_pipeline_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="frontend_implementation_plan",
            description="Frontend implementation plan with framework and architecture",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="backend_implementation_plan",
            description="Backend implementation plan with framework and architecture",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="database_design_and_strategy",
            description="Database design and implementation strategy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="branching_strategy",
            description="Git branching strategy and workflow",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="cicd_pipeline_definition",
            description="CI/CD pipeline definition with quality gates",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="code_review_standards",
            description="Code review standards and automation",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="observability_strategy",
            description="Observability and monitoring strategy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="runbooks_and_adrs",
            description="Runbooks and Architecture Decision Records",
            data_type="array"
        ))

# ============================================================================
# STEP 7: SYSTEM ARCHITECTURE
# ============================================================================

class Step7SystemArchitecture(StepTemplate):
    def __init__(self):
        super().__init__(7, "System Architecture", [6])
        
        # Define roles
        self.add_role(Role(
            name="Solutions_Architect",
            focus="Overall system design, service boundaries, integration patterns",
            validates="Architecture cohesion, scalability, maintainability",
            challenges="Over-engineering, unclear boundaries, tight coupling"
        ))
        
        self.add_role(Role(
            name="Infrastructure_Architect",
            focus="IaC, containerization, orchestration, networking, storage",
            validates="Infrastructure scalability, cost efficiency, disaster recovery",
            challenges="Vendor lock-in, poor resource utilization, no DR plan"
        ))
        
        self.add_role(Role(
            name="Security_Architect",
            focus="Defense-in-depth, zero-trust, encryption, compliance",
            validates="Security layers, least privilege, audit trails",
            challenges="Security gaps, misconfigured permissions, compliance violations"
        ))
        
        self.add_role(Role(
            name="Performance_Engineer",
            focus="Latency optimization, caching, CDN, database tuning",
            validates="Performance SLOs met, efficient resource usage",
            challenges="N+1 queries, cache misses, slow endpoints"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Overall architecture diagram: services, data flow, boundaries"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Microservices vs monolith decision with justification"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="API gateway and communication patterns (REST/gRPC/event-driven)"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Storage layers: databases, caching (Redis, Memcached), object storage"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Scalability and high-availability strategies"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="Architecture diagram shows all services, data flows, and integration points",
            validation_method="architecture_diagram_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Architecture aligns with Step 6 framework and database choices",
            validation_method="architecture_alignment_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Scalability strategy addresses NFRs from Step 3",
            validation_method="scalability_strategy_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="architecture_diagram",
            description="High-level system architecture diagram",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="service_boundaries_and_responsibilities",
            description="Service boundaries and responsibilities",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="communication_patterns",
            description="Service communication patterns and protocols",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="storage_and_caching_strategy",
            description="Storage and caching strategy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="scalability_ha_strategy",
            description="Scalability and high availability strategy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="security_architecture",
            description="Security architecture and threat model",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="integration_points",
            description="External integration points and APIs",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="iac_setup",
            description="Infrastructure as Code setup and configuration",
            data_type="object"
        ))

# ============================================================================
# STEP 8: CODE REVIEW & QUALITY ASSURANCE
# ============================================================================

class Step8CodeReviewQA(StepTemplate):
    def __init__(self):
        super().__init__(8, "Code Review & Quality Assurance", [6, 7])
        
        # Define roles
        self.add_role(Role(
            name="QA_Lead",
            focus="Test strategy, coverage, regression prevention, automation",
            validates="Comprehensive test matrix, CI integration, quality gates",
            challenges="Low coverage, manual testing dependencies, flaky tests"
        ))
        
        self.add_role(Role(
            name="Senior_Developer",
            focus="Code quality, design patterns, maintainability, code review standards",
            validates="SOLID principles, DRY, readable code, proper documentation",
            challenges="Code smells, tech debt, poor abstractions"
        ))
        
        self.add_role(Role(
            name="Test_Automation_Engineer",
            focus="CI test automation, e2e test frameworks, performance testing",
            validates="Automated test execution, fast feedback loops, stable tests",
            challenges="Slow tests, environment dependencies, brittle selectors"
        ))
        
        self.add_role(Role(
            name="Security_Reviewer",
            focus="SAST/DAST, dependency scanning, secure code patterns",
            validates="No critical vulnerabilities, secure defaults, input validation",
            challenges="SQL injection risks, XSS vulnerabilities, insecure dependencies"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Code review standards and automation tools"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Testing strategy: unit, integration, contract, e2e, regression"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="TDD Loop: write tests → implement → refactor → retest"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="CI integration: automated testing on every commit"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Quality gates: coverage thresholds, linting, security scans"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="Test matrix covers all critical user stories from Step 3",
            validation_method="test_matrix_coverage_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Code coverage meets threshold (e.g., 80% unit, 60% integration)",
            validation_method="coverage_threshold_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="All quality gates pass in CI pipeline",
            validation_method="quality_gates_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="test_strategy_and_matrix",
            description="Comprehensive testing strategy and test matrix",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="code_review_checklist",
            description="Code review checklist and standards",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="ci_test_automation_jobs",
            description="CI test automation jobs and configuration",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="quality_gate_thresholds",
            description="Quality gate thresholds and criteria",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="security_scan_results",
            description="Security scan results and remediation plan",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="tdd_loop_validation",
            description="TDD loop validation and refactoring procedures",
            data_type="object"
        ))

# ============================================================================
# STEP 9: DEPLOYMENT & CI/CD AUTOMATION
# ============================================================================

class Step9DeploymentCICD(StepTemplate):
    def __init__(self):
        super().__init__(9, "Deployment & CI/CD Automation", [7, 8])
        
        # Define roles
        self.add_role(Role(
            name="DevOps_Lead",
            focus="CI/CD pipeline orchestration, deployment automation, rollback strategies",
            validates="Zero-downtime deployments, automated rollbacks, pipeline efficiency",
            challenges="Manual steps, slow pipelines, no rollback automation"
        ))
        
        self.add_role(Role(
            name="Platform_Engineer",
            focus="IaC, container orchestration, secrets management, configuration",
            validates="Reproducible infrastructure, secure secrets handling, config management",
            challenges="Snowflake environments, secrets in code, config drift"
        ))
        
        self.add_role(Role(
            name="SRE",
            focus="Deployment reliability, monitoring integration, incident response",
            validates="SLO compliance, alerting setup, runbook completeness",
            challenges="Deployment failures, missing alerts, unclear incident procedures"
        ))
        
        self.add_role(Role(
            name="Release_Manager",
            focus="Release planning, change management, stakeholder communication",
            validates="Release schedules, change approval process, rollback decision matrix",
            challenges="Unplanned releases, poor communication, unclear rollback criteria"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Deployment environments: dev, staging, production"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="CI/CD pipelines: GitHub Actions, GitLab CI, Jenkins, etc."
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="IaC implementation: Terraform, Pulumi, CloudFormation, Ansible"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Containerization: Docker, Kubernetes, ECS, etc."
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Secrets management: Vault, AWS Secrets Manager, etc."
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="CI/CD pipeline fully automated from commit to production",
            validation_method="cicd_automation_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="IaC code provisions all infrastructure reproducibly",
            validation_method="iac_reproducibility_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Secrets never hardcoded; managed via secure vault",
            validation_method="secrets_management_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="cicd_pipeline_configuration",
            description="CI/CD pipeline configuration and automation",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="iac_codebase",
            description="Infrastructure as Code codebase and configuration",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="containerization_strategy",
            description="Containerization strategy and orchestration",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="secrets_management_setup",
            description="Secrets management setup and configuration",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="deployment_environments",
            description="Deployment environments and configuration",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="rollback_procedures",
            description="Rollback procedures and automation",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="deployment_runbooks",
            description="Deployment runbooks and procedures",
            data_type="array"
        ))

# ============================================================================
# STEP 10: MONITORING, MAINTENANCE & OPTIMIZATION
# ============================================================================

class Step10MonitoringOptimization(StepTemplate):
    def __init__(self):
        super().__init__(10, "Monitoring, Maintenance & Optimization", [9])
        
        # Define roles
        self.add_role(Role(
            name="SRE_Lead",
            focus="Observability stack, SLOs/SLIs, error budgets, incident management",
            validates="Comprehensive monitoring, actionable alerts, incident response",
            challenges="Alert fatigue, missing metrics, unclear incident procedures"
        ))
        
        self.add_role(Role(
            name="Performance_Analyst",
            focus="Performance metrics, optimization opportunities, capacity planning",
            validates="Performance SLOs met, bottleneck identification, resource efficiency",
            challenges="Performance regressions, resource waste, poor scaling"
        ))
        
        self.add_role(Role(
            name="Data_Analyst",
            focus="Business metrics, user behavior analytics, A/B testing",
            validates="KPI tracking, user engagement metrics, experiment design",
            challenges="Missing business metrics, poor data quality, no experimentation"
        ))
        
        self.add_role(Role(
            name="Compliance_Officer",
            focus="Privacy compliance, data retention, audit trails, ethical AI monitoring",
            validates="GDPR/CCPA compliance, audit readiness, ethical guidelines adherence",
            challenges="Compliance gaps, missing audit logs, privacy violations"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Observability stack: metrics, logs, traces (Prometheus, Grafana, ELK, etc.)"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="SLOs/SLIs and error budget policy (e.g., 99.5% uptime)"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Alerting strategy: thresholds, escalation, on-call rotation"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Dashboards for system health and business metrics"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Incident response and postmortem process"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="Observability stack deployed and collecting metrics",
            validation_method="observability_deployment_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="SLOs defined with error budgets and alert thresholds",
            validation_method="slo_definition_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="Dashboards provide actionable insights for ops and business",
            validation_method="dashboard_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="observability_stack_configuration",
            description="Observability stack configuration and setup",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="slos_slis_error_budgets",
            description="SLOs, SLIs, and error budget policy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="alerting_and_escalation_policy",
            description="Alerting and escalation policy",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="dashboard_specifications",
            description="Dashboard specifications and configuration",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="incident_response_runbooks",
            description="Incident response runbooks and procedures",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="optimization_backlog",
            description="Optimization backlog and prioritization",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="compliance_monitoring_setup",
            description="Compliance monitoring setup and configuration",
            data_type="object"
        ))

# ============================================================================
# STEP 11: DOCUMENTATION & HANDOVER
# ============================================================================

class Step11DocumentationHandover(StepTemplate):
    def __init__(self):
        super().__init__(11, "Documentation & Handover", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        
        # Define roles
        self.add_role(Role(
            name="Technical_Writer",
            focus="Documentation quality, clarity, completeness, user-friendliness",
            validates="Clear writing, proper structure, searchable, maintained",
            challenges="Outdated docs, poor organization, missing context"
        ))
        
        self.add_role(Role(
            name="Solutions_Architect",
            focus="Architecture documentation, ADRs, system diagrams",
            validates="Architecture clarity, decision rationale, diagram accuracy",
            challenges="Missing context, outdated diagrams, unclear decisions"
        ))
        
        self.add_role(Role(
            name="Developer_Advocate",
            focus="Developer experience, onboarding, getting started guides",
            validates="Easy setup, clear examples, troubleshooting guides",
            challenges="Complex setup, missing prerequisites, no examples"
        ))
        
        self.add_role(Role(
            name="Product_Owner",
            focus="Business documentation, feature specs, roadmap communication",
            validates="Business value clarity, stakeholder alignment, roadmap visibility",
            challenges="Unclear priorities, missing business context, poor communication"
        ))
        
        # Define topics
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="Technical documentation: API docs, architecture, deployment"
        ))
        
        self.add_topic(Topic(
            priority=Priority.CRITICAL,
            description="README and quick-start guides"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Developer onboarding and knowledge transfer materials"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="ADRs (Architecture Decision Records) compilation"
        ))
        
        self.add_topic(Topic(
            priority=Priority.HIGH,
            description="Versioning, changelogs, and dependency documentation"
        ))
        
        # Define completion criteria
        self.add_completion_criterion(CompletionCriterion(
            description="All technical documentation complete and versioned",
            validation_method="technical_documentation_check"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="API documentation auto-generated and accurate",
            validation_method="api_documentation_validation"
        ))
        
        self.add_completion_criterion(CompletionCriterion(
            description="README enables new developer to set up in <30 minutes",
            validation_method="readme_validation"
        ))
        
        # Define output structure
        self.add_output_field(OutputField(
            name="technical_documentation",
            description="Complete technical documentation package",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="api_documentation",
            description="API documentation and specifications",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="readme_and_quickstart",
            description="README and quick-start guides",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="onboarding_materials",
            description="Developer onboarding materials",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="adr_compilation",
            description="Architecture Decision Records compilation",
            data_type="array"
        ))
        
        self.add_output_field(OutputField(
            name="versioning_and_changelogs",
            description="Versioning and changelog documentation",
            data_type="object"
        ))
        
        self.add_output_field(OutputField(
            name="handover_package",
            description="Complete handover package for team transition",
            data_type="object"
        ))

# ============================================================================
# WORKFLOW TEMPLATE REGISTRY
# ============================================================================

class WorkflowTemplateRegistry:
    """Registry for all workflow step templates"""
    
    def __init__(self):
        self.templates = {
            1: Step1ProjectDefinition(),
            2: Step2RoadmapMilestones(),
            3: Step3Requirements(),
            4: Step4AIIntegration(),
            5: Step5UXUIDesign(),
            6: Step6DevelopmentProcess(),
            7: Step7SystemArchitecture(),
            8: Step8CodeReviewQA(),
            9: Step9DeploymentCICD(),
            10: Step10MonitoringOptimization(),
            11: Step11DocumentationHandover()
        }
    
    def get_template(self, step_id: int) -> StepTemplate:
        """Get template for specific step"""
        if step_id not in self.templates:
            raise ValueError(f"Step {step_id} template not found")
        return self.templates[step_id]
    
    def get_all_templates(self) -> Dict[int, StepTemplate]:
        """Get all step templates"""
        return self.templates
    
    def validate_dependencies(self, step_id: int, completed_steps: List[int]) -> bool:
        """Validate that all dependencies for a step are completed"""
        template = self.get_template(step_id)
        return all(dep in completed_steps for dep in template.dependencies)


