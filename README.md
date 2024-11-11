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
  ![Screen Shot of the Chatsy Landing page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-mainpage-image.png)

- Sign up Page
  ![Screen Shot of the Chatsy Signup page](https:/raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-signup-image.png)

- Login Page
  ![Screen Shot of the Chatsy Login page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-login-image.png)

- Home Page
  ![Screen shot of the Chatsy Home page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-chatting-image.png)

- Settings page
  ![Screen shot of the chatsy settings page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-settings-image.png)

- Chatbot page
  ![Screenshot of the chatsy chatbot page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-chatbot-image.png)

- Settings Page
  ![Screen shot of the Chatsy Setting page](https://raw.githubusercontent.com/Deep-patra/Chatsy/development/assets/chatsy-search-image.png)

## Future Plans

- Adding Notification service
- Add PWA support
- Add Groups and Blocking Feature

## License

This project is licensed under MIT, for more information read the LICENSE file in the directory
