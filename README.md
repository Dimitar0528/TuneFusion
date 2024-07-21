# TuneFusion - Music Streaming Application

Welcome to TuneFusion, a modern music streaming application. This README provides comprehensive documentation for the project, including its architecture, setup, and usage.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
4. [Useful Commands](#useful-commands)
5. [Project Architecture](#project-architecture)
   - [Backend](#backend)
   - [Frontend](#frontend)
   - [Database](#database)
6. [Contributing](#contributing)
7. [License](#license)

## 1. Introduction

TuneFusion is a music streaming platform designed to provide users with an intuitive and seamless experience for discovering, playing, and managing their favorite songs and artists. It includes features such as song suggestions, user management robust pagination for easy navigation and much more.

## 2. Features

- **User Authentication**: Register and log in securely.
- **Music Playback**: Play, pause, and navigate through songs.
- **Lyrics Fetching**: Retrieve and display song lyrics.
- **Playlist Management**: Create and manage specific playlists.
- **Pagination**: Efficient navigation through song and user lists.
- **Admin Actions**: Special functionalities for admin users like adding songs to the database and managing user data.
- **And Much More**

## 3. Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 20.x) (https://nodejs.org/en)
- npm (>= 10.x) (comes with Node.js by default)
- MySQL Installer (>= 8.x) (https://dev.mysql.com/downloads/installer/)
- After you have downloaded the MySQL Installer, you need to open it and also install MySQL Server (>= 8.x) and MySQL Workbench (>= 8.x) (reference video: https://www.youtube.com/watch?v=g2rilf_v4V4).

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Dimitar0528/TuneFusion.git
   cd TuneFusion
   ```

2. **Backend Setup**:

   ```bash
   cd server
   npm install
   ```

   2.1. Create a .env file inside the server folder with the following content:

   ```bash
   DB_NAME=your_database_name
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   JWT_SECRET_KEY=your_secret_key_for_jwt
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

   - where the DB\_{VARIABLES} are your MySQL database variables, the JWT_SECRET_KEY is the secret key for signing / verifying the JSON Web Token (JWT) and the SENDGRID_API_KEY is the Sendgrid API Key needed for the 2FA to work. ( How to set up an Sengrid API Key: https://www.twilio.com/docs/sendgrid/ui/account-and-settings/api-keys)

3. **Frontend Setup**:

   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start MySQL**:

   Ensure MySQL is running on your local machine or update the connection string in the backend configuration to point to your MySQL instance.

2. **Run Backend**:

   ```bash
   cd server
   npm run server
   ```

3. **Run Frontend**:

   ```bash
   cd ../client
   npm run dev
   ```

   The application should now be running at `http://localhost:5173/`.

## 4. Useful Commands

All commands are run from the root of the project, from an already opened terminal:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installs dependencies                       |
| `npm run dev`     | Starts local dev client at `localhost:5173` |
| `npm run server`  | Starts local dev server at `localhost:3000` |
| `npm run build`   | Build the production site to `/dist/`       |
| `npm run preview` | Preview the build locally, before deploying |
| `npm run lint`    | Run ESLint to check for code quality        |

## 5. Project Architecture

TuneFusion is built using a modern stack with a clear separation between the backend, frontend, and database layers.

### Backend

- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **APIs**: RESTful API endpoints for interacting with the database and performing CRUD operations.
- **Authentication**: JWT-based authentication for secure user sessions.
- **Dependencies**:
  - express
  - mysql2
  - jsonwebtoken
  - bcryptjs
  - and more

### Frontend

- **Framework**: React.js
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router
- **Pagination**: React Paginate
- **Styling**: CSS (with modular CSS for component-specific styles)

### Database

- **Database**: MySQL
- **ORM**: Sequelize
- **Models**:
  - User: Stores user information and credentials.
  - Song: Stores song metadata, including title, artist, and audio source.
  - PlayList: Stores playlist information and song metadata.

## 6. Contributing

We welcome contributions from the community! Here’s how you can get involved:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Submit a pull request to the main repository.

Please ensure your code follows our coding standards and includes appropriate tests.

## 7. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using TuneFusion! If you have any questions or feedback, feel free to open an issue or reach out to the project maintainers. Enjoy your music streaming experience!
