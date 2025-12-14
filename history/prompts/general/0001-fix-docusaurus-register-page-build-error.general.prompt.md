---
id: "0001"
title: "fix-docusaurus-register-page-build-error"
stage: "green"
date_iso: "2025-12-14"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "hasnain"
command: "$ARGUMENTS"
labels:
  - "bug-fix"
  - "docusaurus"
  - "ssr"
  - "authentication"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - /mnt/d/it-course/physical_ai_humanoid_robotics_textbook/physical-ai-book/src/auth.ts
  - /mnt/d/it-course/physical_ai_humanoid_robotics_textbook/physical-ai-book/src/utils/auth.ts
  - /mnt/d/it-course/physical_ai_humanoid_robotics_textbook/physical-ai-book/src/components/ChatbotUI/index.tsx
tests_yaml: |
  - npm run build (completed successfully)
prompt_text: |
  $ARGUMENTS
response_text: |
  Fixed the Docusaurus build error that was occurring when trying to render the /register page.
  The issue was caused by useDocusaurusContext being called at the module level in utility files,
  which is not allowed during server-side rendering. Fixed by replacing the context hook with
  a function that gets the backend URL from window object or environment variables.
outcome: |
  Successfully fixed the build error. The site now builds successfully and the register page
  renders properly during static site generation.
evaluation: |
  Before the fix: npm run build failed with "Can't render static file for pathname "/register""
  After the fix: npm run build completes successfully
---

## Summary

Fixed the Docusaurus build error that was occurring when trying to render the /register page. The issue was caused by `useDocusaurusContext` being called at the module level in utility files, which is not allowed during server-side rendering.

## Root Cause

Three files had the same issue where `useDocusaurusContext` was being called at the module level (outside of React components), causing errors during server-side rendering:
1. `src/auth.ts`
2. `src/utils/auth.ts`
3. `src/components/ChatbotUI/index.tsx`

## Solution

Changed the implementation in all affected files to use a function that gets the backend URL from the window object or environment variables instead of using the Docusaurus context hook at the module level:

```typescript
const getBackendUrl = () => {
  // 1. Check window object during runtime
  if (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) {
    return (window as any).__BACKEND_URL__;
  }
  // 2. Check process.env during build time
  if (typeof process !== 'undefined' && process.env.FASTAPI_BASE_URL) {
    return process.env.FASTAPI_BASE_URL;
  }
  // 3. Fallback to default
  return 'http://localhost:8000';
};
```

## Files Changed

- `src/auth.ts` - Removed module-level `useDocusaurusContext` and replaced with runtime URL detection
- `src/utils/auth.ts` - Removed module-level `useDocusaurusContext` and replaced with runtime URL detection  
- `src/components/ChatbotUI/index.tsx` - Removed component-level `useDocusaurusContext` and replaced with runtime URL detection

## Verification

- `npm run build` now completes successfully
- The /register page renders correctly during static site generation
- All authentication functionality should work as expected