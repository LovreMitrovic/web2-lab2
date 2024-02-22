# Web2 Lab2 Vulnerability Report

## Live Application
- **URL:** [https://web2-lab2-mck1.onrender.com/](https://web2-lab2-mck1.onrender.com/)

## Implemented Vulnerabilities
The web application at the provided repository and live URL has successfully implemented the following vulnerabilities:

1. **Reflected XSS Vulnerability**
2. **Poor Access Control**

Detailed descriptions of these vulnerabilities are available on the homepage.

## Instructions
Vulnerabilities can be tested in the cloud version without any issues. If you want to run the application locally:

1. Clone the Git repository: `git clone https://github.com/LovreMitrovic/web2-lab2` and navigate to the `web2-lab2` directory.
2. Create a `.env` file in the `web2-lab2` directory.
3. Create a `ssl` directory.
4. In the `ssl` directory, generate keys using: `openssl genrsa -out key.pem && openssl req -new -key key.pem -out scr.pem && openssl x509 -req -days 9999 -in scr.pem -signkey key.pem -out cert.pem`
5. Navigate back to web2-lab2 directory and start application `npm install && npm start`
6. The application is accessible at https://localhost:3000/

## Example of .env file
`ISSUER_BASE_URL=https://dev-hk2w2qtq70yjfdxp.us.auth0.com
CLIENT_SECRET=[censored]
CLIENT_ID=[censored]
SECRET=[censored]
ADMIN_EMAIL=[censored]
`
