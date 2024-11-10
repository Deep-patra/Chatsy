# Chatsy

A Messaging application built with nextjs and firebase.

## Tech stack

This application uses these following technologies

- Nextjs (Web Framework)
- Tailwind CSS (Styling)
- Framer Motion (Transition and Animation)
- Firebase (Storage and Authentiation)

## Get Started

To run this application locally, you need to install firebase locally 

```js
npm i firebase-tools -g
```

then install the firebase emulators mainly storage, firestore and authentication.
Start the emulator in a other terminal session

```sh
firebase emulators:start
```

Make a .env file and set the environmental variables

```.env
NEXT_PUBLIC_NODE_ENV=development
GEMINI_API_KEY=

FIREBASE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_STORAGE_HOST=127.0.0.1:9199

# firebase admin variables

project_id=
client_email=
private_key=
```
make a new terminal session and start the application

```js
npm run dev
```

## Screenshots

The following are the screenshots of the application

- Landing Page
  ![Screen Shot of the Chatsy Landing page](https://user-images.githubusercontent.com/74497717/227284534-1e8e5540-536b-40b9-a671-34c82e0d4ab6.png)

- Sign up Page
  ![Screen Shot of the Chatsy Signup page](https://user-images.githubusercontent.com/74497717/227284851-290abc5c-03b5-4e41-afd8-2dbc97d7aa33.png)

- Login Page
  ![Screen Shot of the Chatsy Login page](https://user-images.githubusercontent.com/74497717/227285015-68bde411-e00e-4206-ae3e-4041c75e3f8a.png)

- Home Page
  ![Screen shot of the Chatsy Home page](https://user-images.githubusercontent.com/74497717/227284330-77655a34-1acb-4780-988a-34d04b3c2626.png)

- Settings Page
  ![Screen shot of the Chatsy Setting page](https://user-images.githubusercontent.com/74497717/227284010-6f14a885-4ebb-4d59-b100-6c419c1856ce.png)

## Future Plans

- Adding Notification service
- Add PWA support
- Add Groups and Blocking Feature

## License

This project is licensed under MIT, for more information read the LICENSE file in the directory
