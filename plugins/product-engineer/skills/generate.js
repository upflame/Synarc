const fs = require('fs');
const path = require('path');

const g1 = require('./generators1.js');
const g2 = require('./generators2.js');
const g3 = require('./generators3.js');
const g4 = require('./generators4.js');
const g5 = require('./generators5.js');

const filePath = path.join(__dirname, 'SKILL.md');
const stream = fs.createWriteStream(filePath, { encoding: 'utf8' });
const w = (s) => stream.write(s + '\n');

w('---');
w('id: product-engineer');
w('name: Product Engineering');
w('version: 1.0.0');
w('description: Comprehensive guide for software engineers operating in product engineering roles, covering the full lifecycle of technical product decisions, customer development, experimentation, metrics, and stakeholder communication.');
w('author: synarc');
w('tags:');
w('  - product-engineering');
w('  - feature-prioritization');
w('  - build-vs-buy');
w('  - technical-product-decisions');
w('  - customer-development');
w('  - product-discovery');
w('  - technical-debt');
w('  - engineering-roi');
w('  - product-strategy');
w('  - experimentation');
w('  - product-metrics');
w('  - roadmapping');
w('  - requirements-engineering');
w('  - stakeholder-communication');
w('  - mvp-methodology');
w('  - product-analytics');
w('  - incident-management');
w('  - platform-product');
w('---');
w('');
w('# SKILL.md - Product Engineer');
w('');
w('**Domain:** Software product engineering at the intersection of technical execution and product outcomes.');
w('');
w('**Primary Persona:** Senior+ software engineer who works directly with product managers, designers, and stakeholders to build products that deliver measurable user and business value.');
w('');
w('**Prerequisite Knowledge:** Solid software engineering fundamentals, experience shipping code to production, familiarity with agile development practices.');
w('');
w('**Outcome:** After internalizing this skill file, the engineer can autonomously make product-aware technical decisions, communicate effectively with product stakeholders, prioritize engineering work in product terms, drive customer discovery, and build platform products with internal developer empathy.');

// Define sections with generators
const sections = [];

// ============ P1 - Persona ============
sections.push({ id: 'P1', title: 'Persona: The Product Engineer', generator: g1.generateP1 });
// ============ P2 - Philosophy ============
sections.push({ id: 'P2', title: 'Product Engineering Philosophy', generator: g1.generateP2 });
// ============ P3 - Prioritization ============
sections.push({ id: 'P3', title: 'Feature Prioritization Frameworks', generator: g1.generateP3 });
// ============ P4 - Build vs Buy ============
sections.push({ id: 'P4', title: 'Build vs. Buy vs. Partner Analysis', generator: g1.generateP4 });
// ============ P5 - Technical Product Decisions ============
sections.push({ id: 'P5', title: 'Technical Product Decisions', generator: g2.generateP5 });
// ============ P6 - Customer Development ============
sections.push({ id: 'P6', title: 'Customer Development for Engineers', generator: g2.generateP6 });
// ============ P7 - Product Discovery ============
sections.push({ id: 'P7', title: 'Product Discovery Methodology', generator: g2.generateP7 });
// ============ P8 - Technical Debt ============
sections.push({ id: 'P8', title: 'Technical Debt Communication', generator: g2.generateP8 });
// ============ P9 - Engineering ROI ============
sections.push({ id: 'P9', title: 'Engineering ROI Analysis', generator: g2.generateP9 });
// ============ P10 - Product Strategy ============
sections.push({ id: 'P10', title: 'Technical Product Strategy', generator: g2.generateP10 });
// ============ P11 - Experimentation ============
sections.push({ id: 'P11', title: 'Rapid Experimentation', generator: g3.generateP11 });
// ============ P12 - Product Metrics ============
sections.push({ id: 'P12', title: 'Product Metrics for Engineers', generator: g3.generateP12 });
// ============ P13 - Roadmapping ============
sections.push({ id: 'P13', title: 'Engineering Contribution to Product Roadmap', generator: g3.generateP13 });
// ============ P14 - Requirements ============
sections.push({ id: 'P14', title: 'Requirements Engineering', generator: g3.generateP14 });
// ============ P15 - Communication ============
sections.push({ id: 'P15', title: 'Stakeholder Communication', generator: g3.generateP15 });
// ============ P16 - MVP ============
sections.push({ id: 'P16', title: 'MVP Methodology', generator: g4.generateP16 });
// ============ P17 - Analytics ============
sections.push({ id: 'P17', title: 'Product Analytics Engineering', generator: g4.generateP17 });
// ============ P18 - Incidents ============
sections.push({ id: 'P18', title: 'Incident Impact on Product', generator: g4.generateP18 });
// ============ P19 - Platform Product ============
sections.push({ id: 'P19', title: 'Platform Product Management', generator: g4.generateP19 });
// ============ P20 - Worked Examples ============
sections.push({ id: 'P20', title: 'Worked Examples', generator: g4.generateP20 });
// ============ P21 - Anti-Patterns ============
sections.push({ id: 'P21', title: 'Anti-Patterns', generator: g5.generateP21 });
// ============ P22 - Quality Gates ============
sections.push({ id: 'P22', title: 'Quality Gates', generator: g5.generateP22 });

for (const section of sections) {
  w('');
  w('---');
  w('');
  w(`## ${section.id} - ${section.title}`);
  w('');
  section.generator(w);
}

stream.end();
console.log('SKILL.md generated successfully');
