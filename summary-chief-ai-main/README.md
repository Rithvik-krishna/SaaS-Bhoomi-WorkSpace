# WorkspaceAI ✨


<p align="center">
  <strong>An AI-powered productivity dashboard that centralizes work emails, documents, and chats — and auto-generates smart summaries and email drafts — all in one place.</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Built%20for-SaaSBoomi%20Hackathon%202025-blueviolet" alt="SaaSBoomi Hackathon 2025">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI GPT-4">
</p>

<p align="center">
  <a href="#key-features"><strong>Key Features</strong></a> ·
  <a href="#screenshots"><strong>Screenshots</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a>
</p>

---

## 🎯 The Problem

In today's fast-paced work environment, professionals are constantly juggling multiple applications: email clients, calendars, document editors, team chats, and project management tools. This constant context-switching leads to lost productivity, fragmented information, and significant mental fatigue.

## 💡 Our Solution

**WorkspaceAI** is an all-in-one productivity dashboard designed to be your single source of truth. By integrating with your essential work tools and leveraging the power of AI, it eliminates the need for app-switching. Our platform not only centralizes your data but also provides intelligent summaries, drafts, and insights, allowing you to focus on what truly matters.

---

## 🚀 Key Features

* **Unified Dashboard:** A central "Briefing" view that aggregates your most important information: new emails, upcoming events, and pending tasks.
* **AI Email Summarization:** Instantly understand the gist of long emails and threads with AI-powered summaries that highlight key points and action items.
* **AI Email Drafting:** Generate professional, context-aware email replies and new drafts with simple prompts, saving you valuable time.
* **Multi-Tool Integration:** Seamlessly connect with your favorite services:
    * **Google Suite:** Gmail, Google Drive, Google Calendar
    * **Collaboration:** Slack, Microsoft Teams
    * **Project Management:** Jira, Notion
    * **Development:** GitHub (for PR summaries & code reviews)
* **Intelligent AI Assistant:** A conversational chatbot to help you schedule meetings, create task lists, analyze documents, and answer questions.
* **Smart & Priority Inbox:** Let AI surface the most important emails and communications, so you can focus on what needs your attention first.
* **Integrated Calendar & Task Management:** View your schedule and manage your daily to-do list without ever leaving the dashboard.

---

## 📸 Video Demo


---

## 🛠️ Tech Stack

This project leverages a modern, robust tech stack to deliver a seamless and intelligent user experience.

* **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
* **AI & Machine Learning:** [OpenAI GPT-4](https://openai.com/gpt-4)
* **Authentication:** [OAuth 2.0](https://oauth.net/2/) for secure integration with third-party services.

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/workspace-ai.git](https://github.com/your-username/workspace-ai.git)
    cd workspace-ai
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary API keys and credentials.
    ```env
    # OpenAI API Key
    VITE_OPENAI_API_KEY=your_openai_api_key

    # Google Cloud OAuth Credentials
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified in your console) to view it in the browser.

---

## 👥 Team

* **Rithvik Krishna DK** - [GitHub](https://github.com/rithvik-krishna) | [LinkedIn](https://www.linkedin.com/in/rithvik-krishna-dk)

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 🙏 Acknowledgements

This project was proudly built for the **SaaSBoomi Hackathon 2025**.