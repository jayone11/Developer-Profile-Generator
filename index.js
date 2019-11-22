const fs = require("fs"); // To be able to access the file system
const axios = require("axios");
const inquirer = require("inquirer");

inquirer
    .prompt({
        message: "Enter a Github username",
        name: "username"
    })
    .then(function({username}) {
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        axios // Use axios module
            .get(queryUrl) // Send GET request to the 'queryUrl'
            .then(function(res) {
                console.log(res.data); // The response object returned from the request should contain a `data` property which should be an array of the user's GitHub repos.
            });
    });
