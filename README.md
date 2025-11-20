# Mine-Assist-
MineAssist is an AI-powered chatbot designed to provide quick and accurate answers to queries about mining laws and regulations. This full-stack web application is built with a React and TailwindCSS frontend and a Node.js and Express backend. It serves as a comprehensive knowledge base for mining regulations, safety procedures, and compliance requirements.

Features
Core Functionality
Intelligent Search: Advanced search algorithm that matches user queries with relevant mining regulations using multiple search strategies
Chat Interface: A clean and user-friendly chat interface with distinct bubbles for user queries and bot responses
Real-time Responses: The chatbot processes user queries and returns relevant information from a comprehensive JSON dataset containing mining laws
Typing Indicator: A typing effect to simulate a more human-like interaction
Clear Chat: A button to clear the chat history and start a new conversation
Feedback Mechanism: Users can provide feedback on the bot's responses with simple "like" and "dislike" buttons
Advanced Features
Multi-strategy Search: Uses key phrase extraction, synonym matching, and relevance scoring to find the best matches
Contextual Understanding: Understands mining-specific terminology and provides accurate regulatory information
Comprehensive Coverage: Covers Mines Act 1952, Mines Rules 1955, and Coal Mines Regulations 2017
Smart Fallbacks: Multiple search strategies ensure users get relevant information even with varied query phrasing
Tech Stack
Frontend: React, TailwindCSS, TypeScript
Backend: Node.js, Express
Data: JSON-based knowledge base with mining regulations
Search Algorithm: Custom implementation with fuzzy matching and relevance scoring
Data Coverage
Mines Act, 1952
Accident reporting procedures and safety requirements
Working hours, weekly rest, and employment conditions
Penalties and compliance requirements
Worker rights and employer obligations
Mines Rules, 1955
Drinking water and sanitation facilities
First-aid and medical facilities
Canteens and welfare amenities
Safety equipment and emergency procedures
Coal Mines Regulations, 2017
Ventilation and gas testing requirements
Fire prevention and safety protocols
Shot-firing and blasting regulations
Emergency evacuation procedures
Project Structure
/client
  /src
    /components
    App.tsx
    main.tsx
/server
  /data
    miningActs.json    # Comprehensive mining regulations database
  /utils
    search.js          # Advanced search algorithm implementation
  index.js             # Express server and API endpoints
/questions.txt         # Sample questions for testing
/README.md
Getting Started
Prerequisites
Node.js (v14 or later)
npm or yarn package manager
Installation
Clone the repository:

git clone https://github.com/your-username/mineassist.git
Navigate to the project directory:

cd mineassist
Install backend dependencies:

cd server
npm install
Install frontend dependencies:

cd ../client
npm install
Running the Application
Start the backend server:

cd server
npm start
The server will run on http://localhost:3001.

Start the frontend development server:

cd client
npm run dev
The application will be accessible at http://localhost:3000.

API Endpoint
The backend exposes the following API endpoint:

POST /api/query: Accepts a user's query and returns a relevant answer from the mining laws dataset.
Request Body
{
  "query": "What are the regulations for coal mines?"
}
Response
{
  "results": [
    {
      "act": "Coal Mines Regulations, 2017",
      "section": "Section 15",
      "title": "Ventilation Requirements",
      "text": "The regulations outline the safety measures and operational guidelines for coal mines.",
      "relevance": 95
    }
  ],
  "message": "Found relevant information about coal mine regulations."
}
Sample Questions
Accident & Safety
"What should I do if there is an accident in the mine?"
"What are the procedures for reporting an accident in a mine?"
"What personal protective equipment is required in mines?"
Working Conditions
"What are the rules regarding weekly days of rest for mine workers?"
"What are the maximum daily and weekly working hours for adults in a mine?"
"What are the provisions regarding employment of women in mines?"
Facilities & Amenities
"What are the requirements for providing drinking water in a mine?"
"What are the regulations for first-aid stations in a mine?"
"What are the rules for providing canteens in mines?"
Technical Regulations
"What are the ventilation requirements in a coal mine?"
"What are the duties of a shot-firer?"
"What is the code of practice for preventing fire in a coal mine?"
For a complete list of sample questions, see the questions.txt file in the project root.

Development Notes
Search Algorithm
The search functionality uses a sophisticated multi-strategy approach:

Key Phrase Extraction: Identifies mining-specific terms and phrases
Synonym Matching: Maps common terms to regulatory terminology
Relevance Scoring: Calculates match scores based on title and content similarity
Fallback Strategies: Multiple search attempts with different approaches
Data Structure
The mining regulations are stored in a structured JSON format containing:

Act names and section numbers
Section titles and detailed text
Metadata for improved search matching
Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Support
For support and questions, please open an issue in the GitHub repository or contact the development team.
