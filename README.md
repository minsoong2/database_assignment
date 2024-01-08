# 💡Bulletin Board Web Application

## Project Overview

This project involves building a web-based bulletin board application. It features standard functionalities such as viewing, posting, and deleting posts and comments. The application uses a MariaDB database for data storage, HTML and web frameworks for the front-end, and Node.js for the back-end.

## 📘Features

1. **View Posts**
   - View all posts in a list format (excluding content/comments).
   - Implement pagination to display 'n' number of posts per page.
2. **Detailed Post View**
   - View all details of a post, including comments.
3. **Create Post**
   - Fields: Author, Title, Content, Date of Creation, Unique ID.
4. **Delete Post**
   - Deletes the post along with its comments.
5. **Create Comment**
   - Fields: Author, Timestamp, Content.
   - Comments are associated with posts (No nested comments).
6. **Delete Comment**
   - Deletes a specific comment.

## 📘Technologies Used

- **Database**: MariaDB
- **Front-End**: HTML, Optional Web Frameworks
- **Back-End**: Node.js with native SQL implementation

## 📘Project Structure

- `index.html`: The main entry point of the web application.
- `db/`: Contains scripts for database schema and initialization.
- `scripts/`: JavaScript files for handling front-end logic.
- `server/`: Node.js server files with SQL queries for database interaction.
- `styles/`: CSS files for styling the web application.

## 🚀Development and Submission Guidelines

- The project should be developed incrementally with regular commits to a private GitHub repository.
- Share the repository with dojinchoi@changwon.ac.kr for review and bonus points.
- Ensure to push commits periodically to demonstrate development progress.

## S🚀ubmission

- Compress the entire project into a single file and submit it on eCampus.
- Include a `Readme.md` file with detailed instructions on setting up and running the application.

## 🚀Running the Application

1. **Database Setup**:
   - Set up a MariaDB database.
   - Run the provided SQL scripts to create the necessary tables.

2. **Server Setup**:
   - Navigate to the `server/` directory.
   - Install dependencies: `npm install`.
   - Start the server: `node server.js`.

3. **Accessing the Application**:
   - Open `index.html` in a web browser to access the application.


I had a fun experience creating a bulletin board :)