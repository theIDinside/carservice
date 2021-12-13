# carservice

Required tools to install:

- [node & npm](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) is needed for the persistent storage.
- yarn package manager (possibly might work using just NPM)

Download the nodejs & npm installer for the platform you are on and install it. NPM will be used to install yarn as a package manager.

After you've installed nodejs and npm, from the command line / prompt / shell of choice type:
`npm install -g yarn`

This will install the yarn package manager.

# Using MongoDB as backing storage

You can skip this step if you don't want to use MongoDB as backing storage, the application will instead use an in memory database (non-persistent)
if it can't connect to a local instance of a MongoDB server.

After that, go to MongoDB and choose the download & install path for the platform your on. Instructions for installing is pretty easy,
no special steps are required, just download the installer (if you're on windows) and run it and keep all the default settings.

If you're on Linux follow the instructions for installing it [here](https://docs.mongodb.com/manual/administration/install-on-linux/).

If you're on linux, you are going to have to start the MongoDB daemon as well; which can be done from a bash shell like so;

```bash
    mongod --dbpath <some/path/you/choose>
```

If you want it to be a background process in the bash shell, don't forget to add a ` &` too.

For instance, if you want the database files to be stored in a folder named `mdb` in the same folder as this repo, go to this folder and type

```bash
    mongod --dbpath ./mdb &
```

## Usage

- From the command line / your shell of choice, go to the folder `frontend/` and type `yarn` - this will install all the required packages.
- From the command line / your shell of choice, go to the folder `backend/` and type `yarn` - this will install all the required packages.
- Start the MongoDB daemon as described above, if you want MongoDB as backing storage, otherwise it will use an InMemory database (non-persistent)

When you've done that, open up a shell and go to the folder `frontend/` and type `yarn serve`, this will spin up a web server for the frontend.
Open up another shell, go to the `backend/` folder and type `node index.js` which will start the backend server, which the front end communicates with.

Once this is done, open a web browser and go to http://localhost:8080
