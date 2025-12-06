# Physical AI & Humanoid Robotics Textbook

This repository contains the source code for the "Physical AI & Humanoid Robotics" textbook, a modern, interactive educational resource built with Docusaurus.

## About the Project

This project aims to provide a comprehensive and engaging learning experience for students and enthusiasts of robotics and artificial intelligence. The textbook is built as a static website with interactive features, including:

*   **RAG Chatbot:** An integrated chatbot that can answer questions about the book's content.
*   **User Personalization:** The content can be tailored to the user's hardware and software background.
*   **Urdu Translation:** The entire book can be translated into Urdu with RTL support.
*   **Interactive Diagrams and Code Samples:** The book is enriched with diagrams and executable code samples to enhance understanding.

## Tech Stack

*   **Docusaurus:** A modern static website generator based on React.
*   **React:** Used for building interactive components.
*   **BetterAuth:** For user authentication and profile management.
*   **Python:** For the RAG system and other backend services.
*   **GitHub Pages:** For hosting the static website.

## Local Development

To get started with local development, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hasnainXdev/physical_ai_humanoid_robotics_textbook.git
    cd physical-ai-humanoid-robotics-textbook/physical-ai-book
    ```

2.  **Install dependencies:**
    ```bash
    yarn
    ```

3.  **Start the development server:**
    ```bash
    yarn start
    ```
    This will open a browser window with the website running in development mode.

## Build

To build the static website for production, run the following command:

```bash
yarn build
```
The generated static files will be located in the `build` directory.

## Deployment

The website is automatically deployed to GitHub Pages whenever changes are pushed to the `main` branch.
