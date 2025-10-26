# Step 7: System Architecture Template

## Overview
This template defines the overall system architecture, including services, data flow, communication patterns, and infrastructure. We'll build on the development process from Step 6 to create a scalable and secure architecture.

## Interactive Questions

### Overall Architecture & Services
**Question 1:** What's your overall architecture approach? Do you prefer a monolithic application, microservices, or a hybrid approach?

*[Follow-up: Ask about team size, complexity, and specific requirements that might influence this decision]*

**Question 2:** How will your application components communicate with each other? Consider REST APIs, GraphQL, message queues, or event-driven patterns.

*[Follow-up: Ask about data flow, real-time requirements, and integration complexity]*

**Question 3:** What external services or APIs will your application integrate with? How will you handle these integrations?

*[Follow-up: Ask about API reliability, data formats, and error handling requirements]*

### Data Architecture & Storage
**Question 4:** What's your data storage strategy? Consider primary database, caching layers, file storage, and data backup requirements.

*[Follow-up: Ask about data relationships, scalability needs, and performance requirements]*

**Question 5:** How will you handle data synchronization and consistency? What's your approach to data integrity across different services?

*[Follow-up: Ask about ACID requirements, eventual consistency, and data conflict resolution]*

**Question 6:** What's your strategy for data migration and versioning? How will you handle schema changes and data updates?

*[Follow-up: Ask about backward compatibility, data transformation, and rollback procedures]*

### Security & Authentication
**Question 7:** How will you handle user authentication and authorization? What security measures will you implement?

*[Follow-up: Ask about user roles, permission levels, and security standards]*

**Question 8:** What's your approach to data encryption and privacy? How will you protect sensitive information?

*[Follow-up: Ask about encryption at rest, in transit, and compliance requirements]*

**Question 9:** How will you handle API security and rate limiting? What measures will prevent abuse and ensure system stability?

*[Follow-up: Ask about API keys, rate limiting, and monitoring requirements]*

### Scalability & Performance
**Question 10:** How do you expect your application to scale? What's your strategy for handling increased load and user growth?

*[Follow-up: Ask about horizontal vs. vertical scaling, load balancing, and performance bottlenecks]*

**Question 11:** What caching strategies will you implement? How will you optimize performance and reduce database load?

*[Follow-up: Ask about Redis, CDN, application-level caching, and cache invalidation]*

**Question 12:** How will you handle real-time features and WebSocket connections? What's your approach to real-time data synchronization?

*[Follow-up: Ask about WebSocket management, connection scaling, and real-time requirements]*

### Infrastructure & Deployment
**Question 13:** What's your hosting and infrastructure strategy? Consider cloud providers, containerization, and serverless options.

*[Follow-up: Ask about cost considerations, team expertise, and specific requirements]*

**Question 14:** How will you handle environment management and configuration? What's your approach to secrets and environment variables?

*[Follow-up: Ask about configuration management, secrets storage, and environment consistency]*

**Question 15:** What's your strategy for monitoring and logging? How will you track system health and performance?

*[Follow-up: Ask about logging levels, metrics collection, and alerting requirements]*

### Integration & Communication
**Question 16:** How will your frontend and backend communicate? What's your API design and data flow strategy?

*[Follow-up: Ask about API versioning, data formats, and error handling]*

**Question 17:** What's your approach to third-party integrations? How will you handle external service dependencies?

*[Follow-up: Ask about API reliability, fallback strategies, and integration testing]*

**Question 18:** How will you handle background jobs and asynchronous processing? What's your strategy for long-running tasks?

*[Follow-up: Ask about job queues, task scheduling, and error handling for background processes]*

### High Availability & Disaster Recovery
**Question 19:** What's your strategy for system reliability and uptime? How will you handle failures and ensure continuous operation?

*[Follow-up: Ask about redundancy, failover mechanisms, and disaster recovery procedures]*

**Question 20:** How will you handle data backup and recovery? What's your approach to data protection and business continuity?

*[Follow-up: Ask about backup frequency, recovery time objectives, and data retention policies]*

**Question 21:** What's your plan for handling traffic spikes and unexpected load? How will you ensure system stability under stress?

*[Follow-up: Ask about auto-scaling, load balancing, and performance monitoring]*

### Infrastructure as Code
**Question 22:** How will you manage your infrastructure? What's your approach to Infrastructure as Code and environment provisioning?

*[Follow-up: Ask about Terraform, CloudFormation, or other IaC tools and team expertise]*

**Question 23:** What's your strategy for managing dependencies and service versions? How will you handle updates and compatibility?

*[Follow-up: Ask about dependency management, version pinning, and update procedures]*

## Output Structure

```json
{
  "step": 7,
  "output": {
    "overall_architecture": {
      "architecture_type": "string",
      "service_boundaries": ["string"],
      "communication_patterns": ["string"],
      "data_flow": "string"
    },
    "services": [
      {
        "name": "string",
        "purpose": "string",
        "technology": "string",
        "dependencies": ["string"],
        "scaling_requirements": "string"
      }
    ],
    "data_architecture": {
      "primary_database": "string",
      "caching_strategy": "string",
      "data_synchronization": "string",
      "backup_strategy": "string"
    },
    "security": {
      "authentication": "string",
      "authorization": "string",
      "encryption": "string",
      "api_security": "string"
    },
    "scalability": {
      "scaling_strategy": "string",
      "load_balancing": "string",
      "caching_layers": ["string"],
      "performance_optimization": ["string"]
    },
    "infrastructure": {
      "hosting_strategy": "string",
      "containerization": "string",
      "environment_management": "string",
      "monitoring_setup": "string"
    },
    "integrations": {
      "api_design": "string",
      "external_services": ["string"],
      "communication_patterns": ["string"],
      "error_handling": "string"
    },
    "reliability": {
      "high_availability": "string",
      "disaster_recovery": "string",
      "backup_procedures": "string",
      "failover_mechanisms": ["string"]
    },
    "infrastructure_as_code": {
      "tooling": "string",
      "environment_provisioning": "string",
      "configuration_management": "string",
      "version_control": "string"
    },
    "architecture_diagrams": {
      "system_overview": "string",
      "data_flow": "string",
      "deployment_diagram": "string",
      "security_architecture": "string"
    }
  }
}
```

## Completion Criteria
- [ ] Overall architecture type and service boundaries defined
- [ ] Service components and their purposes specified
- [ ] Data architecture and storage strategy established
- [ ] Security and authentication approach defined
- [ ] Scalability and performance strategy specified
- [ ] Infrastructure and hosting strategy established
- [ ] Integration and communication patterns defined
- [ ] High availability and disaster recovery plans created
- [ ] Infrastructure as Code approach specified
- [ ] Architecture diagrams and documentation created
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Build on development process from Step 6
- Focus on scalable and maintainable architecture
- Consider both current needs and future growth
- Ensure security and reliability from the start
- Plan for monitoring and observability
- Balance complexity with team capabilities
