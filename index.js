const fs = require("fs"); // To be able to access the file system
const axios = require("axios");
const inquirer = require("inquirer");

inquirer // WHEN prompted for the developer's GitHub username and favorite color
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
                const repoNames = res.data.map(function(repo) {
                    return repo.name;
                });
                console.log()
            });
    });

    
    // THEN a PDF profile is generated
        // The PDF will be populated with the following:
        // Profile image
        // user name
        // Links to the following:

        // User location via Google Maps
        // User GitHub profile
        // User blog


        // User bio
        // Number of public repositories
        // Number of followers
        // Number of GitHub stars
        // Number of users following
