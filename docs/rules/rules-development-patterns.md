# Rules Development Patterns

## Overview
This guide provides instructions for creating new rules for the AI agentic development workflow.

## Core Principles

### 1. Separation of Concerns
- **Entry point** (`.mdc`): brief overview and navigation  
- **Documentation** (`.md`): detailed implementation guides  

### 2. Progressive Disclosure
- Start with high-level concepts
- Link to detailed documentation for specifics
- Don't overwhelm with details upfront

### 3. Confirmation Over Assumption
- Always require user confirmation before implementation
- Ask clarifying questions rather than assume
- Provide checklists for mandatory requirements

### 4. Single Source of Truth
- Information appears once, referenced elsewhere
- No contradictions or duplications
- Clear ownership of each piece of information 

### 5. Practical Guidance
- Include complete, working examples
- Provide troubleshooting for common issues
- Document edge cases and exceptions

## File Organization

### Directory Structure
```
.cursor/
└── rules/
    └── {rule-name}.mdc          # Entry point

docs/
└── {rule-name}/
    ├── overview.md              # Optional detailed overview
    ├── {topic-a}.md             # Topic-specific documentation
    ├── {topic-b}.md             # Additional topics as needed
    └── examples.md              # Optional dedicated examples
```

### Naming Conventions

| Item | Format | Example |
|------|--------|---------|
| Rule file | `kebab-case.mdc` | `entity-management.mdc` |
| Doc folder | same as rule | `docs/entity-management/` |
| Doc files | `kebab-case.md` | `validation-rules.md` |


### When to Split Documentation
Create a separate `.md` file when:
- Topic exceeds ~200 lines
- Used by multiple rules
- Highly technical
- Needs standalone reference

## Entry Point Structure

### Frontmatter Format
Every `.mdc` file starts with YAML frontmatter:
```yaml
---
description: {Concise one-line description}
alwaysApply: false
---
```
- description: Used by AI to match rules to tasks - be specific
- alwaysApply: Always false - rules are applied manually when relevant

### Standard Sections
Every `.mdc` entry point should include:
1. Title (`# Rule Name`) 
2. Table of Contents (numbered with `@` anchors) 
3. Introduction (what, why, when) 
4. Specifications and Confirmation (mandatory for implementation rules)  
5. Core Sections (3-7 topic summaries with doc links) 
6. Best Practices (quick reference) 
7. Troubleshooting (common issues table)  

### Table of Contents Format
```markdown
## Table of Contents

1. @Introduction
2. @Specifications and Confirmation
3. @Topic Structure
4. @Mandatory Components
5. @Implementation Guidelines
6. @Validation Process
7. @Error Handling
8. @Best Practices
9. @Troubleshooting
```
**Note:** Use `@` prefix for anchor links within the document.

## Documentation Structure

### Document Hierarchy

```markdown
# Main Title

## Overview
Brief introduction to the document&apos;s purpose.

## 1. First Major Section
### 1.1 Subsection
#### 1.1.1 Sub-subsection (use sparingly)

## 2. Second Major Section
...

## Examples
Complete, working code examples.

## Related Documentation
Links to related docs.
```

### Section Types
| Section |	Purpose |	Required? |
|------|--------|---------|
|Overview |	Context and purpose |	Yes |
|Technical Details |	Implementation specifics |	Yes |
|Examples |	Working code samples |	Yes |
|Related Documentation |	Cross-references |	Recommended |

## Content Standards

### Writing Style

- **Be concise:** Get to the point quickly
- **Be specific:** Avoid vague language
- **Be actionable:** Tell users what to DO
- **Be consistent:** Use same terms throughout 

### Code Examples

Every code example should be:
- **Complete:** Can be copied and used directly
- **Contextual:** Shows surrounding code when needed
- **Commented:** Explains non-obvious parts
- **Tested:** Verified to work 

```javascript
// GOOD: Complete, contextual example
const Errors = {
  InvalidInput: class extends UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${FEATURE_ERROR}/invalidInput`;
      this.message = "Input validation failed.";
    }
  }
};

// BAD: Incomplete snippet
class InvalidInput extends UseCaseError { ... }
```

### Use Tables for Structured Information

Use tables for:
- Configuration options
- Parameter descriptions
- Comparisons
- Troubleshooting (Issue | Cause | Solution)

## Mandatory Patterns

⚠️ **CRITICAL: These patterns must be included in all implementation-focused rules.** ⚠️

### 1. Confirmation Pattern

For any rule involving implementation, include this exact pattern:

```markdown
### X.X Fundamental Rule

⚠️ **ABSOLUTE MANDATORY REQUIREMENT** ⚠️

**NO IMPLEMENTATION BEFORE USER CONFIRMATION - ZERO EXCEPTIONS!**

Before writing ANY code, you MUST ALWAYS:

1. 🛑 STOP and ASK the user to specify:
   - {Specific question 1}
   - {Specific question 2}
   - {Specific question 3}

2. 🛑 WAIT for explicit user confirmation before proceeding.

3. 🛑 DO NOT proceed with ANY implementation until you have received clear specifications.
```

### 2. Confirmation Checklist

```markdown
## X. Specifications and Confirmation

Before implementation, confirm with the user:

- [ ] {Requirement 1}
- [ ] {Requirement 2}
- [ ] {Requirement 3}
- [ ] Any special requirements or constraints
```

### 3. Structure Overview

Every implementation rule should show the expected file structure:

````
## X. {Topic} Structure

```
project/
├── folder-a/
│   ├── file-1.js          # Description
│   └── file-2.js          # Description
└── folder-b/
    └── config.json        # Description
```

For complete details, see [{doc-name.md}](mdc:docs/{rule-name}/doc-name.md).
````

---

## Visual Hierarchy

### Emphasis Levels

| Level | Syntax | Purpose |
|------|--------|---------|
| Critical | ⚠️ **TEXT** ⚠️ | Mandatory |
| Important | **Bold** | Emphasis |
| Technical | `code` | Code/paths |
| Normal | Plain text | Explanation |

### Warning Indicators

```markdown
⚠️ **CRITICAL**: {Absolute requirement}

⚠️ **WARNING**: {Important caution}

**Note:** {Helpful information}

**Tip:** {Best practice suggestion}
```

### Step Numbering

Use emojis for multi-step processes requiring strict order:

```markdown
1. 🛑 STOP and verify requirements
2. ✅ CONFIRM with user
3. 🔧 IMPLEMENT the solution
4. 🧪 TEST the implementation
```

## Cross-Referencing

### MDC Link Format

For linking from `.mdc` files to documentation:

```markdown
[Display Text](mdc:docs/{rule-name}/{file-name}.md)
```
Examples

```
- Component structure - [component-structure.md](mdc:docs/command/component-structure.md)
- Validation rules - [validation-rules.md](mdc:docs/command/validation-rules.md)
```

### When to Cross-Reference

- DO link to detailed documentation for complex topics
- DO link to related rules when relevant
- DON'T duplicate content that exists elsewhere
- DON'T create circular references

### Related Documentation Section

```
## Related Documentation

- [Related Rule 1](mdc:.cursor/rules/related-rule.mdc)
- [Topic Documentation](mdc:docs/topic/detail.md)
- [External Resource](https://example.com/docs)
```

## Quality Checklist

Before publishing a new rule, verify all items below:

### Structure

- [ ] Entry point is `.mdc` format in `.cursor/rules/`
- [ ] Detailed docs are `.md` format in `docs/{rule-name}/`
- [ ] Table of Contents is present and accurate
- [ ] All sections are numbered consistently

### Content
- [ ] Introduction explains what, why, and when
- [ ] Confirmation pattern is included (for implementation rules)
- [ ] No contradictions with existing rules
- [ ] No duplicated information
- [ ] All technical terms are explained or linked
- [ ] Examples are complete and working

### Formatting
- [ ] `alwaysApply: false` in frontmatter
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Code blocks have language specifiers
- [ ] Tables are properly formatted
- [ ] Links use correct MDC format

### Usability
- [ ] Can be understood without prior context
- [ ] Troubleshooting section addresses common issues
- [ ] Best practices are actionable
- [ ] Cross-references work correctly

## Templates

### Entry Point Template
Save as `.cursor/rules/{rule-name}.mdc`:

````
---
description: {One-line description for AI rule matching}
globs: 
  - "{relevant file patterns}"
alwaysApply: false
---

# {Rule Title}

## Table of Contents

1. @Introduction
2. @Specifications and Confirmation
3. @{Topic} Structure
4. @Mandatory Components
5. @Implementation Guidelines
6. @Validation Process
7. @Error Handling
8. @Best Practices
9. @Troubleshooting

## 1. Introduction

{Brief description of what this rule covers}, where:

- {Key characteristic 1}
- {Key characteristic 2}
- {Key characteristic 3}

For detailed implementation guides, see:
- {Topic A} - [{topic-a.md}](mdc:docs/{rule-name}/topic-a.md)
- {Topic B} - [{topic-b.md}](mdc:docs/{rule-name}/topic-b.md)

### 1.1 Fundamental Rule

⚠️ **ABSOLUTE MANDATORY REQUIREMENT** ⚠️

**NO IMPLEMENTATION BEFORE USER CONFIRMATION - ZERO EXCEPTIONS!**

Before writing ANY code, you MUST ALWAYS:

1. 🛑 STOP and ASK the user to specify:
   - {Question 1}
   - {Question 2}
   - {Question 3}

2. 🛑 WAIT for explicit user confirmation before proceeding.

3. 🛑 DO NOT proceed with ANY implementation until you have received clear specifications.

## 2. Specifications and Confirmation

Before implementation, confirm with the user:

- [ ] {Requirement 1}
- [ ] {Requirement 2}
- [ ] {Requirement 3}
- [ ] Any special requirements or constraints

## 3. {Topic} Structure

```
{directory structure with descriptions}
```

For complete details, see [{doc-name.md}](mdc:docs/{rule-name}/doc-name.md).

## 4. Mandatory Components

Every implementation requires:

1. **{Component 1}** - {Description}
2. **{Component 2}** - {Description}
3. **{Component 3}** - {Description}

## 5. Implementation Guidelines

Follow these steps in order:

1. **{Step 1}** - {Description}
2. **{Step 2}** - {Description}
3. **{Step 3}** - {Description}

For detailed guidelines, see [{implementation-guide.md}](mdc:docs/{rule-name}/implementation-guide.md).

## 6. Validation Process

{Brief validation overview}

See [{validation-doc.md}](mdc:docs/{rule-name}/validation-doc.md) for details.

## 7. Error Handling

{Brief error handling overview with code example}

```javascript
const Errors = {
  {ErrorName}: class extends UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ERROR_PREFIX}/{errorCode}`;
      this.message = "{Error message}";
    }
  }
};
```

## 8. Best Practices

- {Best practice 1}
- {Best practice 2}
- {Best practice 3}
- {Best practice 4}

## 9. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| {Issue 1} | {Cause} | {Solution} |
| {Issue 2} | {Cause} | {Solution} |
| {Issue 3} | {Cause} | {Solution} |

````

### Documentation Template (.md)
Save as `docs/{rule-name}/{topic}.md`:

````
# {Topic Title}

## Overview

{Detailed explanation of what this document covers and its purpose}

## 1. {First Major Section}

### 1.1 {Subsection}

{Detailed content}

### 1.2 {Subsection}

{Detailed content}

## 2. {Second Major Section}

### 2.1 {Subsection}

{Detailed content}

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value | Value | Value |

### 2.2 {Subsection}

{Detailed content}

```javascript
// Code example with comments
```

## 3. {Third Major Section}

{Content as needed}

## Examples

### Example 1: {Basic Example}

{Description of what this example demonstrates}

```javascript
// Complete, working code example
```

### Example 2: {Advanced Example}

{Description}

```javascript
// Complete, working code example
```

## Related Documentation

- [{Related Doc 1}](mdc:docs/{folder}/{file}.md)
- [{Related Doc 2}](mdc:docs/{folder}/{file}.md)
- [{Related Rule}](mdc:.cursor/rules/{rule}.mdc)
````