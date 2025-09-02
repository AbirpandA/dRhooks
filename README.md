# dRhooks - A Component Registry for shadcn/ui

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Welcome to dRhooks! [cite_start]This is a personal collection of reusable and beautifully-designed UI components built to extend the amazing [shadcn/ui](https://ui.shadcn.com/) library. [cite: 1, 5]

[cite_start]The components are built on top of Radix UI primitives and styled with Tailwind CSS, designed to accelerate your development workflow. [cite: 2]


## 🤔 What is this?

This repository is not an NPM package. It's a **component registry**. Think of it as an unofficial extension to the `shadcn/ui` catalog. It contains a variety of useful components that you can easily add to your projects.

The core philosophy is the same as `shadcn/ui`:
* [cite_start]**You own the code:** Components are meant to be copied and pasted directly into your project. [cite: 7] This gives you full control over styling, behavior, and functionality.
* **Built for customization:** Easily adapt the components to match your application's design system.
* [cite_start]**Free to use:** All components are free for personal and commercial use. [cite: 6]

## 🚀 Getting Started

Using components from this registry is straightforward.

### Prerequisites

[cite_start]You must have **`shadcn/ui` installed and configured** in your project. [cite: 8] [cite_start]If you haven't done this yet, please follow the official [installation guide](https://ui.shadcn.com/docs/installation). [cite: 9]

### How to Add a Component

1.  **Browse the Components**: Navigate to the [`components/registry/default`](https://github.com/AbirpandA/dRhooks/tree/main/components/registry/default) directory to see all available components.
2.  **Copy the Code**: Open the folder for the component you want (e.g., `shiny-button`) and copy the contents of the `.tsx` file.
3.  **Paste into Your Project**: Create a new file in your project's `components/ui` directory (e.g., `shiny-button.tsx`) and paste the code.
4.  **Install Dependencies**: Check the component file for any new dependencies and install them if necessary.
5.  **Use It**: Import the component into your application and start using it!

## ✨ Available Components

This registry includes a growing list of components, such as:

* Bento Grid
* Dock
* Evervault Card
* Globe
* Infinite Moving Cards
* Retro Grid
* Shiny Button
* Word Pull-Up
* ...and more!

## 🙏 Acknowledgements

This project stands on the shoulders of giants. Full credit goes to the creators of these incredible tools:

* [**shadcn/ui**](https://ui.shadcn.com/): For the component architecture, style, and distribution method.
* [cite_start][**Radix UI**](https://radix-ui.com/): For providing accessible and composable low-level UI primitives. [cite: 10]
* [cite_start][**Tailwind CSS**](https://tailwindcss.com): For the utility-first CSS framework that makes styling a breeze. [cite: 10]