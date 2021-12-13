# carservice - InMemory "database"

This branch / version does not need MongoDB installed. It doesn't have persistent storage, it just keeps the data alive in a hashmap.

Use this for testing, if you don't want to install an intrusive application / software like MongoDB. The functionality for the end user is identical, with the
exception that, if the backend dies - so does the data. But seeing as how this is a technical review, I can't see why that would matter (and if it does, the master branch uses MongoDB for the persistent storage).

Required tools to install:

- [node & npm](https://nodejs.org/en/download/)
- yarn package manager (possibly might work using just `npm install`)

Download the nodejs & npm installer for the platform you are on and install it. NPM will be used to install yarn as a package manager.

After you've installed nodejs and npm, from the command line / prompt / shell of choice type:
`npm install -g yarn`

This will install the yarn package manager.

## Usage

- From the command line / your shell of choice, go to the folder `frontend/` and type `yarn` - this will install all the required packages for the frontend
- From the command line / your shell of choice, go to the folder `backend/` and type `yarn` - this will install all the required packages for the backend

When you've done that, open up a shell and go to the folder `frontend/` and type `yarn serve`, this will spin up a web server for the frontend.
Open up another shell, go to the `backend/` folder and type `node index.js` which will start the backend server, which the front end communicates with.

Once this is done, open a web browser and go to http://localhost:8080
