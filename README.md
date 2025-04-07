---

## Overview

Comments 4 Me is a code commenting assistant that leverages AI to automatically generate meaningful, contextual comments for your code. This tool helps developers improve code documentation by analyzing code snippets and suggesting appropriate comments, saving time and ensuring better code maintainability.

---

## Stack

Frontend:

- HTML
- CSS
- JS

Backend:

- Node.js
- Express.js

---

## Project Structure

```bash
comments-4-me/
├── server/
│   ├── server.js         # Express server configuration
│   └── ai-service.js     # Gemini API integration
├── public/
│   ├── index.html        # Main application interface
│   ├── script.js         # Frontend functionality
│   ├── styles.css        # Application styling
│   ├── prism.js          # Syntax highlighting library
│   └── prism.css         # Syntax highlighting styles
├── .env                  # Environment variables (not included in source)
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

---

## Dependencies

The following are important to the well functioning of the application, run the install command if some are missing.  

```json
"dependencies": {
  "cors": "^2.8.5",        // Enables communication between frontend and backend 
  "dotenv": "^16.4.7",     // Loads environment variables from .env 
  "express": "^5.1.0",     // Web framework for the backend 
  "multer": "^1.4.5-lts.2" // Middleware for file upload
}
```

```bash
npm install cors dotenv express multer axios
```

---

## Environment variables

The application requires the following environment variables to be set in a `.env` file.

```bash
PORT=3000                      # Port for the Express server
GEMINI_API_KEY=your_api_key    # Google Gemini API key
```

To obtain a google gemini api key, go to https://aistudio.google.com/apikey.

---

## How to use

1. Import your code file by dragging it to the appropriate zone or uploading it.
2. Give a context or extra instructions to the assistant (optional).
3. Click the “Generate Comments” button and and wait a few seconds. 
4. Enjoy your commented code!

---

## Author

created by Azmi-Salah Bousedra

Github: [@AzmiBousedra](https://github.com/AzmiBousedra)

Linkedin: [@azmibousedra](http://www.linkedin.com/in/azmibousedra)

---

## Acknowledgment

This project is licensed under the MIT License.

 

- [Google Gemini API](https://ai.google.dev/) for powering the AI comment generation
- [Prism.js](https://prismjs.com/) for the syntax highlighting functionality
- [Express.js](https://expressjs.com/) for the server framework
