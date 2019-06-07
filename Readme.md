# File Upload Example

Code along with: <https://www.youtube.com/watch?v=b6Oe2puTdMQ&t=1s>

```zsh
touch server.js
# makes the package.json
npm init -y
yarn add express express-fileupload
# add dev dependencies
yarn add -D nodemon concurrently
```

```json
// package.json
...
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js",
  "client": "npm start --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\"",
}
```

Setup server.js, then

```zsh
create-react-app client
```

## Font Awesome React

<https://github.com/FortAwesome/react-fontawesome#installation>

in the react client folder...

```zsh
# in /client...
yarn add @fortawesome/free-brands-svg-icons
yarn add @fortawesome/fontawesome-svg-core
yarn add @fortawesome/free-solid-svg-icons
yarn add @fortawesome/react-fontawesome
```
