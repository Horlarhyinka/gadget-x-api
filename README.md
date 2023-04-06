"# gadget-x api" 

A REST api for an e-commerce website which enables cross-platform shopping built with node js(javascript)

Technologies used:
- Node js
- express
- mongodb
- redis
- cheerio
- nodemailer
- paystack
- passport
- jwt

**installation**
1. Clone the repository: git clone https://github.com/Horlarhyinka/gadget-x-api.git
2. Install dependencies: run `npm install`
3. install redis-server (check https://redis.io/docs/getting-started/ for instructions)
4. create .env file in project root directory and add all variables listed below

#PORT -- port number to run application 

#BASE_URL -- api base url http://localhost:<port>/api/v1/ 

#SECRET -- api secret e.g hjwgqdjkjhqkejhk712613681

#AGE -- token expiration age e.g 3600

#DB_URL -- database connection string e.g mongodb://localhost:27017/<db name>
 
#CLIENT_ID -- client ID for google oauth (create credentials at https://console.cloud.google.com)

#CLIENT_SECRET -- client secret for google oauth

#MAIL_HOST --  mail host for nodemailer config smtp.gmail.com or smtp.mailtrap.io to use mailtrap service

#MAIL_PORT -- mail port for nodemailer config 465

#MAIL_PASSWORD -- application specific password from gmail see https://support.google.com/mail/answer/185833?hl=en on ho to generate password

#PAYSTACK_SECRET -- for paystack api

#PAYSTACK_TEST_PUBLIC_KEY -- paystack api publick key(test mode)

#PAYSTACK_BASE_URL -- paystack api base url https://api.paystack.co/transaction/

#CACHE_TIME -- cache time for redis storage 216000

#MAIL_ADDRESS -- email address user@gmail.com

#DURATION -- constant value used in email template

#REDISHOST -- for redis configuration (required only in production environment)

#REDISPASSWORD -- for redis configuration (required only in production environment)

#REDISPORT -- for redis configuration (required only in production environment)

#REDISUSER -- for redis configuration (required only in production environment)

5. start redis-server from terminal (wsl on windows) `sudo service redis-server start`
6. run `npm start`

**Usage**

project includes CRUD operations for getting e-commerce data.

external datas can be fetched from jumia.com (web scraped with cheerio)

authentication is implemented with jwt and oauth2.0 passport authentication

caching was implemented with redis to improve performance and speed

payments (test mode ) implemented with paystack

email services for after-order confirmation, new admin sign-up, and news-letter

add product is restricted to users of _kind admin only

an admin can only be authorized by an authorized admin

see link below to view documentation in postman

https://documenter.getpostman.com/view/20519100/2s93RZLpYY
