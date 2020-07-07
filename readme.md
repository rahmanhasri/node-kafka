## NodeJs - Kafka And Express API with MongoDB

HOW TO USE

- Deploy it with Docker
1. Install docker machine and docker compose in your os
2. run terminal ```docker-compose up -d```
3. API ready at localhost:3000
4. Kafka ready to insert data with topic 'test'. Example producer in file ./kafka/producer.js.

Notes:
1. to use producer edit brokers value in ./kafka/connection.js from ```kafka:9092``` to ```localhost:9092``` or ```127.0.0.1:9092```

2. accountNumber and identityNumber column in model-user are already indexed so query to those column are faster

List: of basic routes:
|Route|HTTP|Header(s)|Body|Description|
|---------|---------|---------|---------|---------|
|_/token_|**GET**|none|none|request client authentication token|
|_/user_|**GET**|authorization|none|request list user|
|_/user_|**POST**|authorization|none|request insert user|
|_/user/:id_|**PUT**|authorization|none|request delete user by id|
|_/user/:id_|**DELETE**|authorization|none|request delete user by id|

Additional Information:

### - **GET Token**

request token to access user routes

+ **URL**

  /token

+ **Method**

  GET

+ **Success Response**

      { "token": "eyJhbGciOiJIUzI1NiJ9.cmFobWFuaGFzcmk.zrHhwpTTkS1QfQnw8MgtDi--_lmpTCLwzs7jUBj6fbX" }

### - **GET User**

request list user with filter and pagination

+ **URL**

  /user

+ **Method**

  GET

+ **Params**

      headers : { authorization: $token }
      query: {
        accountNumber[optional],
        identityNumber[optional],
        page[optional],
        limit[optional]
      }

+ **Success Response**

      {
        "data": [{
          "_id": "5f03115eb5c5ea251787802d",
          "userName": "maman",
          "accountNumber": 123456,
          "emailAddress": "maman3@gmail.com",
          "identityNumber": 87654,
          "__v": 0
        }, {
          "_id": "5f033d7acb503072f3e8fc45",
          "userName": "maman",
          "accountNumber": 234566,
          "emailAddress": "maman4@gmail.com",
          "identityNumber": 98765,
          "__v": 0
        }]
      }

### - **POST User**

Request insert new user to DB

+ **URL**

  /user

+ **Method**

  POST

+ **Params**

      headers : { authorization: $token }
      body : {
        userName[string],
        accountNumber[integer],
        identityNumber[integer],
        emailAddress[string][unique]
      }

+ **Success Response**

      {
        "success": true,
        "data": {
          "_id": "5f044401fe5ac10084755a22",
          "userName": "maman",
          "accountNumber": 123456,
          "emailAddress": "maman9@gmail.com",
          "identityNumber": 1234567,
        }
      }


+ **Error Response**

      -
      { err: true, message : error validation }
      -
      { message: 'userName must be at least 4 character long' }
      -
      { message: 'Invalid email format'}
      -
      { message: 'this email is taken. please use another email.'}

### - **PUT User**

request edit user by id

+ **URL**

  /user/:id

+ **Method**

  PUT

+ **Params**

      headers : { authorization: $token }
      body : {
        userName[string],
        accountNumber[integer],
        identityNumber[integer],
        emailAddress[string][unique]
      }


+ **Success Response**

      {
        "data": {
          "_id": "5f044401fe5ac10084755a22",
          "userName": "maman",
          "accountNumber": 123456,
          "emailAddress": "maman9@gmail.com",
          "identityNumber": 1234567,
          "__v": 0
        }
      }


+ **Error Response**

      - 404
      { message:  'User not found' }
      - 400
      { err: true, message : error validation }

### - **DELETE User**

request delete user by id

+ **URL**

  /user/:id

+ **Method**

  DELETE

+ **Params**

      headers : { authorization: $token }
      body : {
        userName[string],
        accountNumber[integer],
        identityNumber[integer],
        emailAddress[string][unique]
      }


+ **Success Response**

      {
        message: 'user deleted'
      }


+ **Error Response**

      - 404
      { message:  'User not found' }
