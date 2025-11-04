# dRhooks 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-purple)](https://ui.shadcn.com/)

A curated collection of high-quality React hooks and beautifully-designed UI components built on top of [shadcn/ui](https://ui.shadcn.com/). Built with TypeScript, React, and Tailwind CSS to supercharge your development workflow.

## ✨ Features

- 🎨 **Beautiful Components**: Extending shadcn/ui with new, carefully crafted components
- 🎣 **Custom Hooks**: Collection of production-ready React hooks
- 📦 **Zero-Install Usage**: Copy and paste what you need
- 🎯 **TypeScript First**: Full type safety and autocompletion
- 🎭 **Fully Customizable**: Adapt components to match your brand
- ⚡ **Performance Focused**: Optimized for speed and efficiency
- 📱 **Responsive Design**: Works seamlessly across all devices
- ♿ **Accessible**: Following WCAG guidelines and best practices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React 19+
- Next.js 15+
- shadcn/ui (follow their [installation guide](https://ui.shadcn.com/docs/installation))
- Tailwind CSS

### Installation

1. **Set up shadcn/ui**

   ```bash
   npx shadcn-ui init
   ```

2. **Configure Your Project**
   - Ensure your project has Tailwind CSS configured
   - Add the required dependencies from the component you want to use

## 📦 Available Components

### UI Components

- 🎨 **Interactive Elements**
  - `<BounceButton />` - Interactive button with bounce animation
  - `<LoadingSwap />` - Smooth loading state transitions
  - `<ShimmerText />` - Text with attractive shimmer effect

### Custom Hooks

- ⚡ **Performance Hooks**
  - `useDebounce` - Debounce your function calls
  - `useFetch` - Fetch data with built-in states
  - `useLocalStorage` - Persist state in localStorage

## 📖 Usage Example

```tsx
import { BounceButton } from "./components/ui/bounce-button";

function App() {
  return <BounceButton>Click me!</BounceButton>;
}
```

## 🛠️ Component Integration

1. **Choose a Component**

   - Browse the components in the `src/registry/new-york` directory
   - Check the component's documentation in `src/content/docs`

2. **Copy the Code**

   - Copy the component code from the respective file
   - Paste it into your project's components directory

3. **Install Dependencies**

   - Check the component's dependencies in its documentation
   - Install any required packages

4. **Use the Component**
   - Import and use the component in your application
   - Customize as needed using the provided props and styles

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build registry
pnpm build:registry

# Build documentation
pnpm build:docs
```

## 📚 Documentation

Visit our documentation site for:

- Detailed API references
- Live examples
- Best practices
- Customization guides
- Performance tips

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component foundation
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

This project stands on the shoulders of giants. Full credit goes to the creators of these incredible tools:

- [**shadcn/ui**](https://ui.shadcn.com/): For the component architecture, style, and distribution method.
- [cite_start][**Radix UI**](https://radix-ui.com/): For providing accessible and composable low-level UI primitives. [cite: 10]
- [cite_start][**Tailwind CSS**](https://tailwindcss.com): For the utility-first CSS framework that makes styling a breeze. [cite: 10]
