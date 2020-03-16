[![Build Status](https://travis-ci.org/victorsteven/Premier-League.svg?branch=master)](https://travis-ci.org/victorsteven/Premier-League) [![Coverage Status](https://coveralls.io/repos/github/victorsteven/Premier-League/badge.png?branch=master)](https://coveralls.io/github/victorsteven/Premier-League?branch=master)


Postman Documentation: https://documenter.getpostman.com/view/4595252/SzS2xo8W?version=latest

Heroku API: https://premier-league-fx.herokuapp.com

### Clone the application 

Using SSH:
```
git clone https://github.com/victorsteven/Premier-League.git
```

#### Change to the application directory:
```
cd Premier-League
```
### Install Dependencies
```
npm install
```

### Add JWT Secret
Create a **.env** from the root directory
```
touch .env
```
Simply copy the content of **.env.example** file, you can change the value of the **JWT_SECRET**

### Run the Application

```
npm run dev
```

### Run Tests Suite

```
npm test
```
