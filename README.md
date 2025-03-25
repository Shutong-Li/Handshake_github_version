<!-- Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. -->

# HANDSHAKE 

## Connecting Nature Scot Professionals & Affiliated Students

Welcome to HandShake, a collaborative platform designed to bridge the gap between NatureScot professionals and students from affiliated universities or research institutions. This project empowers users to discover, connect and collaborate with like minded individuals through a structured profile search system, enhanced by intelligent filtering mechanism.

## Project Overview 

HandShake is an innovative web-based platform that allows:

- Nature Scot professionals to showcase their expertise and engage 
     with students.

- Students from affiliated universities/research centers to find and   connect wih professionals in their field of interest.

- Users to search and filter profiles based on universities, affiliations, and work factors.

- VIP (Virtually Integrated Project) creation where users can initiate collaborative projects.

- Event & Post sharing to facilitate communication and networking.

This project is built using Django for backend and React Native (Java Script) for the frontend, ensuring a scalable, high performance and intutive experience.

## Tech Stack

| Component | Technology Used |
| :--- | :--- | 
| Frontend      | React Native(Java Script) |
| Backend    | Django(Python) | 
| Database | PostgreSQL / SQLite | 
| API Calls |  Axios | 
| Authentication | JWT (JSON Web Token) |
| Styling | CSS |
| Deployment| Render |


## Features

| Feature | Description |
| :--- | :--- | 
| User Profiles     | View detailed profile of professionals and students |
| Search & Filtering    | Find users based on University, expertise and affiliation. | 
| VIP Creation | Users can create and manage collaborative projects. | 
| Event & Post Management |  Share upates,research and opportunities | 
| Secure-Authentication | JWT (JSON Web Token) based authentication for security.|
| Responsive Design | Easy to navigate. |


## Project Sturcture
![tree](https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh21/sh21-main/-/wikis/imageFolder/tree.png) 

# Getting started

Inbuilt-login the visitor can use for backup:
- username: alice_jones
- password: password123

## Backend (Django Setup)

Prerequisites:
- Python 3.8+
- PostgreSQL(or SQLite for development)

## Frontend ( React Native Setup)

Prerequisites:
- Node.js 16+
- React Native CLI

Now after fullfilling the above condition,
Please follow the [User Guide](https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh21/sh21-main/-/wikis/UserGuide)

## API Endpoints

| Method | Endpoint | Description     |
| :--- | :--- | :---   |
| GET      | /api/profile/ | Fetch user profiles    |
| GET    | /api/search/ | Search and filter users      |
| POST | /api/upload-profile-picture/ |  Upload profile pictures   |
| POST |  /api/create-vip | Create VIP projects     |
| GET | /api/user-events  |  Fetch user events      |
| POST | /api/login/ | User authentication |


## Contributions

The website at the moment is in testing sector so we welcome contributions to improve HandShake! 

To contribute:
1. Fork the repository.
2. Create a new branch (feature/your-feature-name)
3. Commit your changes . Make sure that git commit are quite cleared when pushed and should explain all the things you have added in the feature.
4. Push to the branch .( git push origin feature/ your-feature-branch)
5. Create a pull request.


# License 

HandShake is licensed under the Apache License 2.0. See the LICENSE file for details.

# Contact & Support

For any queries, feature requests or contributions, consult the wiki




# HandShake - Building bridges between NatureScot & Students!



