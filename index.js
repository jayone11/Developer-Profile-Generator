const fs = require("fs"); // To be able to access the file system
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

const colors = {
    blue: {
        userInfoBackground: "#4392F1",
        galleryItem: "#4392F1"
    },
    red: {
        userInfoBackground: "#B51926",
        galleryItem: "#B51926"
    },
    green: {
        userInfoBackground: "#68B684",
        galleryItem: "#68B684"
    }
}

function promptUser() {
    return inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "Enter GitHub Username"
      },
      {
        type: "checkbox",
        name: "color",
        message: "What is your favorite color?",
        choices: ["blue", "red", "green"]
      }
    ])
    .then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`;      
        return axios // Use axios module
            .get(queryUrl) // Send GET request to the 'queryUrl'
            .then(res => {
                console.log("API Call #1", res.data); // The response object returned from the request should contain a `data` property which should be an array of the user's GitHub repos.
                let newUrl = `https://api.github.com/users/${username}/starred`;
                
                
                axios
                    .get(newUrl) // Send GET request for starred repos
                    .then(starredRepos => {
                        
                        if(res.data.bio === null) {
                            res.data.bio = `<h3 class="user-bio">${res.data.name} does not have a GitHub Bio</h3>`
                        }
                        
                        if(res.data.blog === null) {
                            res.data.blog = `<h3 class="user-blog">${res.data.name} has not added a blog.</h3>`
                        }

                        data = {
                            name: res.data.name,
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

                        console.log("API Call #2",data)
                        generateHTML(data);
                        writeToHTML(generateHTML(data));
                        generatePdf(username);
                    });
            });
    });

    function generateHTML(data) {
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
            <div class="container user-info-container" style="background-color:${colors[data.color].userInfoBackground}">
            <!-- <div class="overlay01"></div>
                <section id="section01" class="demo">
                    <a href="#"><span></span></a>
                </section>-->
                <div class="user-info">
                    <h1 class="username">Hello, my name is ${data.name}</h1>
                    <h2 class="location">Located in ${data.location}</h2>
                    <h3 class="user-bio">${data.userBio}</h3>
                    <div class="social-media">
                        <a href="${data.gitProfile}" alt="" class="profile-github">GitHub</a>
                        <a href="https://${data.userBlog}" alt="" class="profile-github">Blog</a>    
                    </div>
                </div>
                
                <div class="profile">
                    <img src="${data.img}" alt="" class="profile-img">    
                </div>
                
            </div>
        </header>

        <main>
            <div class="container">
                <div class="gallery">

                    <div class="gallery-item" tabindex="0" style="background-color:${colors[data.color].galleryItem}">
                        <div class="gallery-item-info"><p>Public Repositories</p></div>
                        <h2 class="count rep-count">${data.repoNum}</h2>
                    </div>

                    <div class="gallery-item" tabindex="0" style="background-color:${colors[data.color].galleryItem}">
                        <div class="gallery-item-info"><p>Followers</p></div>
                        <h2 class="count followers-count">${data.followers}</h2>
                    </div>
            
                    <div class="gallery-item" tabindex="0" style="background-color:${colors[data.color].galleryItem}">
                        <div class="gallery-item-info"><p>GitHub Stars</p></div>
                        <h2 class="count stars-count">${data.starNum}</h2>
                    </div>
                    
                    <div class="gallery-item" tabindex="0" style="background-color:${colors[data.color].galleryItem}">
                        <div class="gallery-item-info"><p>Following</p></div>
                        <h2 class="count following-count">${data.following}</h2>
                    </div>

                </div>
            </div>
        </main>    
    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    </body>
    </html>`
    };
}

const writeToHTML = function(generateHTML){
    writeFileAsync("index.html", generateHTML);
    }
    
     promptUser();
    
     async function generatePdf(username){
    // console.log(username);
      try {
     
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

    await page.goto('file:///Users/hildadubon/sites/ucla-projects/hw-7/Developer-Profile-Generator/index.html');
      await page.emulateMedia("screen");
      await page.pdf({ 
        path: `${username}.pdf`,
        format: "A4",
        printBackground: true,
        landscape: false
      });
      
      console.log("Succesfully generated PDF");
      await browser.close();
    } catch (error) {
    console.log("Error generating PDF");
    }
    }
    
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
