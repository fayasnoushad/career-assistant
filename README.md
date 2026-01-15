## Career Assistant

Career Assistant is a web application designed to find courses, roadmaps, and jobs for career development. It leverages AI models like Gemini to provide personalized recommendations based on user inputs. The application also includes web scraping capabilities to fetch the latest job listings from various sources.

---

### Features

- Search for courses based on your interests and career goals
- Find roadmaps tailored to your career goals
- Search for jobs based on your skills and preferences
- AI-powered jobs and roadmap recommendations according to user prompts
- Web scraping for up-to-date job listings
- Save and manage your favorite courses, roadmaps, and jobs
- Salary predictions for jobs where salary not disclosed
- User-friendly interface with Next.js and Tailwind CSS

---

### Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, DaisyUI, Redux (for state management)
- **Backend**: FastAPI (Python), Selenium (for web scraping)
- **Database**: MongoDB
- **AI Models**: Gemini

---

### Getting Started

Clone the repository and follow the setup instructions for both the backend and frontend.

```bash
git clone https://github.com/fayasnoushad/career-assistant.git
cd career-assistant
```

#### Backend

using uv (recommended)

```bash
cd backend
uv add -r requirements.txt
uv run fastapi dev
```

using pip

```bash
cd backend
pip3 install -r requirements.txt
fastapi dev
```

The backend server will run at http://localhost:8000

#### Frontend

```bash
cd frontend
npm install
# Run the development server
npm run dev
```

The frontend server will run at http://localhost:3000

---

### Usage

Once both the backend and frontend are running, you can access the application at `http://localhost:3000`.

---
