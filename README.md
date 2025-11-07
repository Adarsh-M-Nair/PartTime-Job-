WorkBee: The College Part-Time Job Connector

WorkBee is a full-stack, role-based application built on the MERN (MongoDB, Express, React, Node.js) stack designed to seamlessly connect college students looking for flexible work with local businesses offering part-time jobs (catering, delivery, tutoring, etc.).

This project was developed as a submission for a Database Management Systems (DBMS) course, focusing on demonstrating proper data modeling, secure API design, and role-based access control (RBAC).

Key Features

WorkBee supports two primary user roles, ensuring distinct and secure experiences for each user type:

Student Role

Job Discovery: Browse a feed of active job postings from local employers.

Application Submission: Apply to jobs with detailed student profile information.

Application Tracking: View the real-time status (Pending, Interview, Hired, Rejected) of all submitted applications.

Profile Management: Maintain a profile with university, major, and year of study.

Employer Role

Job Posting: Create, edit, and deactivate job listings.

Applicant Review: View all applications submitted for their specific job postings.

Status Management: Update the status of a student's application, triggering updates on the student dashboard.

Profile Management: Maintain detailed company and contact information.

Technology Stack

WorkBee is a comprehensive MERN application. The clear separation of concerns between the API backend and the React frontend makes it scalable and maintainable.

Backend (Server)

Database: MongoDB (via Mongoose ODM) for flexible, NoSQL data storage.

Framework: Node.js and Express.js to build a secure and fast RESTful API.

Security: JWT (JSON Web Tokens) for stateless authentication and authorization, enforced via custom middleware.

Data Modeling: Implementation of references (simulating foreign keys) across five main collections: User, StudentProfile, EmployerProfile, JobPosting, and Application.

Frontend (Client)

Framework: React (with Functional Components and Hooks) for a dynamic, single-page application experience.

Styling: Tailwind CSS for rapid, utility-first styling and responsive design.

Integration: Asynchronous data fetching using the native fetch API to communicate with the Express backend.

DBMS Course Relevance

The core strength of this project lies in its backend design:

Normalization/Data Separation: Separating the generic User authentication details from specific StudentProfile and EmployerProfile documents.

Referential Integrity: Enforcing logical relationships between collections (e.g., ensuring an Application always links to a valid JobPosting and StudentProfile using Mongoose references).

Complex Query Logic: Implementing API routes that require joining/populating data from multiple collections (e.g., retrieving an Employer's applicants and populating the Student's profile details).
