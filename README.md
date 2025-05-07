## Overview

This is a **dashboard built with Vue 3, TypeScript, and D3.js**, focused on data visualization. It was made in just **two days for a job interview**, with the goal of showing my ability to work with a modern frontend stack.

At the moment, the project **does not fetch data from a real API**. Instead, it uses **mocked data** to simulate realistic content. In the future, I'd like to integrate a **free public API** to make the data dynamic and more relevant.

**Live Demo**: [https://d3dashboard-ten.vercel.app/](https://d3dashboard-ten.vercel.app/)


## Tech Stack

* **Vue 3** with the Composition API
* **TypeScript** for type safety and better developer experience
* **Vite** for lightning-fast builds and hot module replacement
* **Single File Components (SFCs)** using the `<script setup>` syntax
* **D3.js** for interactive data visualizations
* **Sass** and **Bootstrap** for modular and maintainable styling

## Design Decisions

This project was built specifically for a job interview at Distillery, following the tech stack requirements from the job description. Here's why each technology choice made sense for this role:

### Vue 3 & TypeScript
The job description specifically requested Vue 3. While TypeScript wasn't a requirement, I decided to add it to demonstrate my commitment to code quality and type safety. I kept the TypeScript implementation basic but effective, showing that I can work with types without overcomplicating the codebase. This addition helps catch potential errors early and makes the code more maintainable.

### D3.js
D3.js was specifically required in the job description. I implemented it to create simple data visualizations. While D3.js has a steeper learning curve than other charting libraries, I think it is the best data visualization library out there.

### Vite
The job description mentioned modern build tools, and Vite is currently the recommended build tool for Vue 3 projects. It provides an excellent development experience and really fast production builds, which is crucial for a dashboard application.

### Styling with Sass & Bootstrap
The job requirements included experience with modern CSS tools. I used Bootstrap for rapid development (useful for a two-day project) and Sass to demonstrate my ability to write maintainable, modular CSS.

### Mock Data Approach
Given the two-day timeframe, I focused on building a fully functional frontend with realistic mock data. This approach demonstrates:
- Understanding of data structures and API design
- Ability to work independently
- Focus on delivering a working solution
- Planning for future API integration using Axios

### Project Structure
I organized the project to showcase best practices in Vue development:
- Single File Components for better maintainability
- `<script setup>` syntax for cleaner code
- Clear separation of concerns (SOLID principles)
- Modular architecture

This structure demonstrates my understanding of Vue best practices and ability to write maintainable code, which were key requirements in the job description.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/sebatanes/d3dashboard.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Future Improvements

* **API Integration**: Replace mock data with a real, public API to make the dashboard dynamic and data-driven.
* **Component Architecture**: Refactor into smaller, reusable components for better maintainability.
* **UI/UX Enhancements**: Improve styling, responsiveness, and accessibility.
* **More Visualizations**: Add multiple types of charts or filters to explore data in different ways.
* **Testing**: Add unit and end-to-end tests to ensure long-term reliability with Vitest.

---

Made with ❤️ and mate in Argentina

---