# Exam Duty Scheduler

Exam Duty Scheduler is a project aimed at automating the scheduling of exam duties for faculty members. This tool ensures a fair and balanced distribution of duties, taking into account various constraints and preferences.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Contributions](#contributions)
- [Contact](#contact)

## Features

- **Automated Scheduling**: Automatically generate duty schedules for faculty members.
- **Constraint Handling**: Incorporate various constraints such as availability, preferences, and workload balance.
- **User-Friendly Interface**: Easy-to-use interface for inputting data and generating schedules.

## Installation

To install the Exam Duty Scheduler, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Mini-Project2024/Exam-Duty-scheduler.git
    ```
2. cd to the folder
   ```bash
    cd Exam-Duty-schduler
   ```
3. Open the terminal and split it and in one terminal open frontend folder
   ```bash
    cd frontend
   ```
   and in another teminal for backend
   ```bash
   cd backend
   ```
4. Install the depenedencies in both the folder
   ```bash
    npm install
   ```
5. Run the frontend folder with the command
   ```bash
    nmp run dev
   ```
6. In backend create a `.env' file and add the MongoDB url
   ```
    MONGODB_URL = "Your Url"
    PORT = 3106
   ```
7. Run the backend folder by the command
   ```bash
    npm start
   ```
8. Go to the link from the frontend and to login to admin page enter the credentials
   
   `Username` = myadmin
   
   `Password` = admin123
10. The admin must assign the faculty username, email and password in the admin page
11. After the admin has created the faculty-user they may login to faculty page
12. Roles of admin:
    + Create the faculty account
    + Add the examination date
    + Assign duty to faculty
13. Roles of Faculty:
    + May view their work assigned
    + May shift thier work with other faculty with the `admin` approval.

## Contributors

This is a team project, and we grateful for the contributions of all team members:

<a href="https://github.com/Mini-Project2024/Exam-Duty-scheduler/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Mini-Project2024/Exam-Duty-scheduler&nocache=1" />
</a>



Thank you for your hard work and dedication in making Exam-Duty-Scheduler a reality!

## Contact

For questions, suggestions, or feedback, please contact any of the members.

<mark>Thank you for using CONNECTO! We hope this platform enhances your campus experience.</mark>

