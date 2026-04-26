import express from "express";

const app = express();

app.get("/api/jokes", (req, res) => {
  res.json([
    { name: "joke1", joke: "it is first one" },
    { name: "joke2", joke: "it is second one" },
    { name: "joke3", joke: "it is third one" },
    { name: "joke4", joke: "it is fourth one" }
  ]);
});

app.listen(5500, () => {
  console.log("server is running at port 5500");
});














app.use((err,req,res,next)=>{
   console.log(err);
})

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 8080;

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // You can also specify a virtual path prefix
// app.use('/static', express.static('public'));

// // Using absolute path (recommended)
// app.use('/assets', express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Static Files Example</h1>
//     <img src="/images/logo.png" alt="Logo">
//     <link rel="stylesheet" href="/css/style.css">
//     <script src="/js/script.js"></script>
//   `);
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
// This assumes you have a directory named public in the same directory as your script with subdirectories for images, CSS, and JavaScript files.

// Routing in Separate Files
// For better organization, you can define routes in separate files using Express Router:

// routes/users.js
// const express = require('express');
// const router = express.Router();

// // Middleware specific to this router
// router.use((req, res, next) => {
//   console.log('Users Router Time:', Date.now());
//   next();
// });

// // Define routes
// router.get('/', (req, res) => {
//   res.send('Users home page');
// });

// router.get('/:id', (req, res) => {
//   res.send(`User profile for ID: ${req.params.id}`);
// });

// module.exports = router;

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Products list');
});