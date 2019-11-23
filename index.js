const fs = require("fs"); // To be able to access the file system
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
// const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

let img = "";
let location = "";
let gitProfile = "";
let userBlog = "";
let userBio = "";
let repoNum = 0;
let followers = 0;
let following = 0;
let starNum = 0;
let color = ""; 

function promptUser() {
    return inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "Enter GitHub Username"
      },
      {
        type: "input",
        name: "Favorite Color",
        message: "What is your favorite color?"
      }
    ])
}
// inquirer // WHEN prompted for the developer's GitHub username
    // .prompt({
    //     message: "Enter a Github username",
    //     name: "username"
    // })
function getRepoInfo(username) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios // Use axios module
            .get(queryUrl) // Send GET request to the 'queryUrl'
            .then(function(res) {
                console.log("",res.data); // The response object returned from the request should contain a `data` property which should be an array of the user's GitHub repos.
                let newUrl = `https://api.github.com/users/${username}/starred`;
                axios
                    .get(newUrl)
                    .then(starredRepos => {
                        data = {
                            img: res.data.avatar_url,
                            location: res.data.location,
                            gitProfile: res.data.html_url,
                            userBlog: res.data.blog,
                            userBio: res.data.bio,
                            repoNum: res.data.public_repos,
                            followers: res.data.followers,
                            following: res.data.following,
                            starNum:starredRepos.data.length,
                            username: username,
                            color: color
                        };
                    });

                    // generateHTML(data);
                    // writeHTML(generateHTML(data));
                    // madePdf(username);
                // const numfollowers = res.data.map(function(followers) {
                //     return followers.
                // })

                // console.log("Repositories:", repoNames.length); // Log the total number of repos (jayone11 should return 14)
            });
            
            // inquirer // WHEN prompted for the developer's favorite color
            //     .prompt({
            //         message: "What is your favorite color?",
            //         name: "Favorite Color"
            //     })
            //     .then(function(favoriteColor) {
            //         console.log(favoriteColor);
            //     });   

}

function generateHTML(answers) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Developer Profile Generator</title>
        <link rel="stylesheet" href="style.css">

    </head>
    <body>
        <header>
            <div class="container">
            <!-- <div class="overlay01"></div>
                <section id="section01" class="demo">
                    <a href="#"><span></span></a>
                </section>-->
                
                <div class="profile">
                    <div class="user-info">
                        <h1 class="username">${answers.name}</h1>
                    </div>
                    <img src="${answers.img}" alt="" class="profile-img">    
                </div>
                
            </div>
        </header>

        <main>
            <div class="container">
                <div class="gallery">

                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>Public Repositories</p></div>
                        <span class="rep-count"></span>
                    </div>

                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>Followers</p></div>
                        <span class="followers-count"></span>
                    </div>
            
                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>GitHub Stars</p></div>
                        <span class="stars-count"></span>
                    </div>
                    
                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>Following</p></div>
                        <span class="following-count"></span>
                    </div>

                </div>
            </div>
        </main>    
    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    </body>
    </html>`
}

async function init() {
    // console.log("hi")
    try {
      const answers = await promptUser();
      const repos = getRepoInfo(answers.username)
      const html = generateHTML(answers);

      
  
      await writeFileAsync("index.html", html);
  
      console.log("Successfully wrote to index.html");
    } catch(err) {
      console.log(err);
    }
  }
  
  init();
    // .then(function({username}) {
    //     const repoUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    //     axios // Use axios module
    //         .get(repoUrl) // Send GET request to the 'queryUrl'
    //         .then(function(res) {
    //             // console.log(res.data); // The response object returned from the request should contain a `data` property which should be an array of the user's GitHub repos.
    //             // const numfollowers = res.data.map(function(followers) {
    //             //     return followers.
    //             // })
    //             const repoNames = res.data.map(function(repo) {
    //                 return repo.name;
    //             });
    //             console.log("Repositories:", repoNames.length); // Log the total number of repos (jayone11 should return 14)
    //         });
            
    //         inquirer // WHEN prompted for the developer's favorite color
    //             .prompt({
    //                 message: "What is your favorite color?",
    //                 name: "Favorite Color"
    //             })
    //             .then(function(favoriteColor) {
    //                 console.log(favoriteColor);
    //             });

    //         axios
    //             .get()
    // });

    // inquirer
    //     .prompt({
    //         message: "What is your favorite color?",
    //         name: "favoriteColor"
    //     })
    //     .then(function(res) {

    //     });

    // How to give the user multiple prompts
    
    
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
