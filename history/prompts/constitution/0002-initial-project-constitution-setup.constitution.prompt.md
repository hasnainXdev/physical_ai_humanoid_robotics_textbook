id: 0002
title: Initial Project Constitution Setup
stage: constitution
date: 2025-12-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["project-setup", "constitution"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

```text
This document defines the global rules, expectations, boundaries, evaluation criteria, and execution model for the entire project.
All Specs, Tasks, Chapters, Agents, and Code must follow this constitution.

📌 Project Title

AI/Spec-Driven Book with Integrated RAG Chatbot & Personalization Features

🎯 Primary Objective

Build and publish a complete AI-engineered educational book using:

Spec-Kit Plus → for all writing, structuring, planning, spec-driven automation

Claude Code → for chapter generation, subagents, reusable intelligence

Docusaurus → for UI & deployed book

GitHub Pages → for public hosting

This book must not be handwritten; it must be spec-generated, agent-executed, and automation-driven.

🧠 Core Deliverables (Required)
1. AI/Spec-Driven Book Creation

The book must be:

Fully specified using Spec-Kit Plus (constitution, features, tasks, chapters)

Written entirely using Claude Code with specs as the driver

Rendered using Docusaurus

Deployed publicly on GitHub Pages

2. Integrated RAG Chatbot (Required)

A Retrieval-Augmented Generation (RAG) chatbot must be built, integrated, and capable of:

Answering questions based only on the book’s content

Answering questions using user-selected text only

Using this stack:

Tech Stack Requirements

OpenAI Agents / ChatKit SDK

FastAPI backend

Neon Serverless Postgres

Qdrant Cloud Free Tier

The chatbot must be embedded inside the book UI.

🏆 Scoring Model (Global Rule)
Base Score: 100 Points

Given only if features #1 and #2 are fully implemented.

🎁 Bonus Points (Up to +150 Total)
3. +50 Points → Reusable AI Intelligence (Claude Subagents & Skills)

Examples:

Claude Code subagents for repetitive writing

Custom agent skills reused across chapters

Automated chapter drafting pipelines

Spec-driven linting agents

Semantic editing agents

4. +50 Points → Signup + Signin (BetterAuth)

Required behavior:

Implement authentication via https://www.better-auth.com/

During signup, ask:

Hardware background

Software background

Store this in the user profile

Use this information later for personalized content delivery

5. +50 Points → Chapter-Level Personalization Toggle

Requirements:

Logged-in users must see a “Personalize Chapter for Me” button

When pressed:

The chapter content must adjust based on user’s background

Could simplify explanations, add examples, or change difficulty

6. +50 Points → Urdu Translation Toggle

Requirements:

A button at the start of each chapter: “Translate to Urdu”

The translated content must appear instantly

Must support:

RTL style

Unicode Urdu

Plugin or custom logic inside Docusaurus

📐 Style & Quality Requirements

All generated content must follow:

Engineering-first writing

Clear specs → clear chapters → clear code

No fluff, no filler text

Code examples wherever relevant

Diagrams via Mermaid where useful

Every chapter must include:

Learning objectives

Explanation

Examples

Code snippets

Summary

Quiz or interactive component (if possible)

🔧 Tooling Rules
Allowed Tools

Spec-Kit Plus

Claude Code

Claude Code Subagents

OpenAI Agents SDK

ChatKit

FastAPI

Neon Serverless Postgres

Qdrant Cloud

Docusaurus

BetterAuth

GitHub Pages

GitHub Actions

Forbidden

Manual writing

Non-spec-generated content

Ignoring constitution constraints

Skipping required tech stack items

🔄 Project Execution Flow (Global Rule)

All work must follow this chain:

/sp.constitution → /sp.features → /sp.tasks → /sp.chapter-* → generated docs → Docusaurus → Deploy → Integrate RAG → Deploy final


Every new feature, chapter, or task must comply with this constitution.

📜 Definition of Done

A project is only complete when:

The book is fully generated & deployed on GitHub Pages

RAG chatbot works end-to-end

All chapters render correctly in Docusaurus

All buttons (Personalization / Urdu) work

All specs pass internal consistency checks

No manual content is used

All required tools are used
```

## Response snapshot

The project constitution has been successfully updated and saved to `.specify/memory/constitution.md` with version `0.1.0`. This includes the project title, objectives, core deliverables, scoring model, style and quality requirements, tooling rules, project execution flow, definition of done, and governance rules.

## Outcome

- ✅ Impact: Project constitution defined and saved.
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: Continue with `/sp.features` to define project features.
- 🧠 Reflection: The constitution template was successfully populated based on the user's input. The process for versioning and date tracking was established.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
