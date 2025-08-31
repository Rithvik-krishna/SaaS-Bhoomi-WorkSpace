# ✨ WorkspaceAI: Your Intelligent Work Hub

<p align="center">
  <img src="https://i.imgur.com/image_6e7618.jpg" alt="WorkspaceAI Banner" width="850"/>
</p>

<p align="center">
  <strong>In a world of digital noise, focus is the new superpower. WorkspaceAI is an intelligent dashboard built to restore that focus by unifying your work and automating intelligence.</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Built%20for-SaaSBoomi%20Hackathon%202025-blueviolet" alt="SaaSBoomi Hackathon 2025">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI GPT-4">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
</p>

---

## 📚 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 The Problem

The modern professional drowns in a sea of digital tools. We lose up to **40% of our productivity** simply switching between email, calendars, team chats, and documents. This constant context-switching fragments our attention, creates information silos, and leads to inevitable burnout.

## 💡 Our Solution

**WorkspaceAI** is a unified command center for your digital life. By integrating with your essential tools and layering a powerful AI assistant on top, we eliminate the need for app-switching. Our platform doesn't just centralize information—it synthesizes, summarizes, and helps you act on it, allowing you to reclaim your focus for high-impact work.

---

## 🚀 Key Features

* **🤖 AI-Powered Briefing:** Start your day with a unified dashboard showing priority emails, upcoming meetings, and key tasks.
* **📧 Smart Email Summary:** Instantly get the gist of long emails and threads with one-click AI summaries that highlight key points and action items.
* **✍️ AI Email Drafting:** Generate professional, context-aware emails in seconds based on simple prompts.
* **🌐 Multi-Tool Integration:** Seamlessly connects with your favorite services:
    * **Google Suite:** Gmail, Google Drive, Google Calendar
    * **Collaboration:** Slack & Microsoft Teams
    * **Development & PM:** GitHub, Jira, & Notion
* **💬 Conversational AI Assistant:** A built-in chatbot to help you schedule meetings, create task lists, and find information across your apps.

---

## 📸 Screenshots

| Unified Dashboard                                   | AI-Powered Email Analysis                          |
| --------------------------------------------------- | -------------------------------------------------- |
| ![Dashboard](https://i.imgur.com/image_6e72dc.png)      | ![Email AI Analysis](https://i.imgur.com/image_6e7295.png) |

---

## 🛠️ Tech Stack

This project leverages a modern, robust tech stack to deliver a seamless and intelligent user experience.

| Category              | Technology                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Frontend** | [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)             |
| **UI Components** | [ShadCN UI](https://ui.shadcn.com/)                                                                          |
| **AI & LLM** | [OpenAI GPT-4](https://openai.com/gpt-4)                                                                     |
| **Authentication** | [OAuth 2.0](https://oauth.net/2/)                                                                            |
| **APIs & Integrations** | Google APIs (Gmail, Drive, Calendar)                                                                         |

---

## 🏁 Getting Started

Follow these instructions to get a local copy of WorkspaceAI up and running on your machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

* **Node.js**: `v18.0.0` or higher.
* **Package Manager**: `npm`, `yarn`, or `pnpm`.

### Installation & Setup

1.  **Clone the repository to your local machine:**
    ```sh
    git clone [https://github.com/your-username/workspace-ai.git](https://github.com/your-username/workspace-ai.git)
    cd workspace-ai
    ```

2.  **Install the necessary dependencies:**
    ```sh
    npm install
    # OR yarn install
    # OR pnpm install
    ```

3.  **Set up your environment variables:**
    Create a new file named `.env.local` in the root of your project directory. Copy the contents of the `.env.example` file (or the block below) into it and replace the placeholder values with your actual API keys and credentials.

    **File: `.env.local`**
    ```env
    # OpenAI API Key for AI features (summaries, drafting, etc.)
    VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

    # Google Cloud Platform OAuth 2.0 Credentials
    # Required for Gmail, Drive, and Calendar integration
    VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    VITE_GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    ```
    > **Note:** You can obtain your Google credentials from the [Google Cloud Console](https://console.cloud.google.com/) and your OpenAI key from the [OpenAI Platform](https://platform.openai.com/).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:5173
