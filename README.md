# carservice

Required tools to install:

- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) is needed for the persistent storage. 
- yarn package manager (possibly might work using just NPM)

## Usage
- From the command line, go to the folder `frontend/` and type `yarn` - this will install all the required packages.
- From the command line, go to the folder `backend/` and type `yarn` - this will install all the required packages.

When you've done that, open up a shell and go to the folder `frontend/` and type `yarn serve`, this will spin up a web server for the frontend.
Open up another shell, go to the `backend/` folder and type `node index.js` which will start the backend server, which the front end communicates with. 
The backend is responsible for communicating with MongoDB.

Once this is done, open a web browser and go to http://localhost:8000
