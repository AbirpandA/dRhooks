## Description

<!-- Describe your changes in detail -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 🧩 New component
- [ ] 🪝 New hook
- [ ] 📝 Documentation update
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 🔧 Chore (maintenance, refactoring, etc.)

## Related Issue

<!-- If this PR addresses an issue, link it here -->

Fixes #

## Component/Hook Details (if applicable)

**Name:** <!-- e.g., BounceButton -->
**Type:** <!-- Component / Hook -->
**Dependencies:** <!-- List any new npm dependencies -->

## Checklist

<!-- Mark completed items with an "x" -->

### General

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings

### For New Components/Hooks

- [ ] I have added the component/hook to the registry (`registry-ui.ts` or `registry-hooks.ts`)
- [ ] I have created an example file in `registry/new-york/examples/`
- [ ] I have added the example to `registry-examples.ts`
- [ ] I have created documentation in `content/docs/`
- [ ] I have run `pnpm build:registry` successfully

### Testing

- [ ] I have tested my changes locally with `pnpm dev`
- [ ] I have tested the shadcn CLI installation: `npx shadcn@latest add "http://localhost:3000/r/[component].json"`
- [ ] The component/hook works in both light and dark mode
- [ ] The component is responsive (mobile-friendly)

### Documentation

- [ ] I have updated the README if needed
- [ ] I have added/updated JSDoc comments for exported functions
- [ ] I have included usage examples in the docs

## Screenshots/Videos (if applicable)

<!-- Add screenshots or screen recordings of your changes -->

## Additional Notes

<!-- Any additional information that reviewers should know -->
