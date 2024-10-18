<div align="center">
<p>
  <img src="./logo/Ingress.png" width="160">
</p>

<p>
<img src="./logo/title.png" width="400">
</p>

[![Open Issues](https://img.shields.io/github/issues/code-monk08/entry-management?style=for-the-badge)](https://github.com/code-monk08/entry-management/issues) [![Forks](https://img.shields.io/github/forks/code-monk08/entry-management?style=for-the-badge)](https://github.com/code-monk08/entry-management/network/members) [![Stars](https://img.shields.io/github/stars/code-monk08/entry-management?style=for-the-badge)](https://github.com/code-monk08/entry-management/stargazers) ![Maintained](https://img.shields.io/maintenance/yes/2024?style=for-the-badge&logo=github)  ![Made with Node.js](https://img.shields.io/badge/Made%20with-Nodejs-blueviolet?style=for-the-badge&logo=node)  ![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%99%A5-red?style=for-the-badge&logo=open-source-initiative)  ![Built with Love](https://img.shields.io/badge/Built%20With-%E2%99%A5-critical?style=for-the-badge&logo=ko-fi) [![Telegram/codemonk08](https://img.shields.io/badge/Telegram-Chat-informational?style=for-the-badge&logo=telegram)](https://telegram.me/codemonk08)

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## About

Ingress is an easy-to-use MVP (Minimum Viable Product) for entry management. It was built using Node.js and MongoDB database with Mongoose ODM. The application uses EJS (Embedded JavaScript templates) for server-side rendering and supports sending emails and SMS notifications using the Nodemailer module and Nexmo API, respectively.

This project was implemented as a submission for the [summergeeks 2020](https://summergeeks.in/) internship challenge by [Innovacer](https://innovaccer.com/). It meets all the criteria mentioned in the assignment provided by summergeeks.

## Features

- User authentication (register, login, logout)
- Host dashboard for managing visitors
- Add new visitors
- Check-in and check-out functionality
- Email notifications to hosts upon visitor check-in
- SMS notifications to hosts upon visitor check-in
- Email notifications to visitors upon check-out
- Responsive design using Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templates, Tailwind CSS
- **Authentication**: Passport.js
- **Notifications**: Nodemailer (Email), Nexmo API (SMS)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/code-monk08/entry-management.git
   cd entry-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   SECRET=your_secret_key
   EMAIL=your_email@gmail.com
   PASSWORD=your_email_password
   NEXMOAPIKEY=your_nexmo_api_key
   NEXMOAPISECRET=your_nexmo_api_secret
   ```

4. Start MongoDB:
   ```bash
   mongod
   ```

5. Run the application:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5000`
2. Register as a new host or login if you already have an account
3. Use the dashboard to add visitors and manage check-ins/check-outs

## Project Structure

```
.
├── app.js                 # Main application file
├── config/                # Configuration files
│   ├── auth.js            # Authentication middleware
│   ├── keys.js            # Database configuration
│   └── passport.js        # Passport.js configuration
├── models/                # Database models
│   ├── Host.js            # Host model
│   └── Visitor.js         # Visitor model
├── routes/                # Route handlers
│   ├── hosts.js           # Host-related routes
│   └── index.js           # Main routes
├── views/                 # EJS templates
│   ├── dashboard.ejs      # Dashboard view
│   ├── layout.ejs         # Main layout
│   ├── login.ejs          # Login view
│   ├── register.ejs       # Registration view
│   ├── welcome.ejs        # Welcome page
│   └── partials/          # Partial views
│       └── messages.ejs   # Flash messages partial
├── public/                # Static files
│   └── styles/            # CSS files
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## API Endpoints

- `GET /`: Welcome page
- `GET /dashboard`: Host dashboard (requires authentication)
- `POST /visitors`: Add a new visitor
- `POST /visitor/:id/checkin`: Check-in a visitor
- `POST /visitor/:id/checkout`: Check-out a visitor
- `GET /hosts/login`: Login page
- `GET /hosts/register`: Registration page
- `POST /hosts/register`: Register a new host
- `POST /hosts/login`: Authenticate a host
- `POST /hosts/logout`: Logout a host

## Environment Variables

- `PORT`: The port number on which the server will run
- `SECRET`: Secret key for session management
- `EMAIL`: Email address for sending notifications
- `PASSWORD`: Password for the email account
- `NEXMOAPIKEY`: Nexmo API key for SMS notifications
- `NEXMOAPISECRET`: Nexmo API secret for SMS notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

Please make sure to update tests as appropriate and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For any questions or support, please [open an issue](https://github.com/code-monk08/entry-management/issues) or contact the maintainer.