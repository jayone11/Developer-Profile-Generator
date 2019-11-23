const fs = require("fs"); // To be able to access the file system
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "Enter GitHub Username"
      },
      {
        type: "input",
        name: "color",
        message: "What is your favorite color?"
      }
    ])
    .then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`;      
        return axios // Use axios module
            .get(queryUrl) // Send GET request to the 'queryUrl'
            .then(res => {
                // console.log("API Call #1", res.data); // The response object returned from the request should contain a `data` property which should be an array of the user's GitHub repos.
                let newUrl = `https://api.github.com/users/${username}/starred`;
                
                
                axios
                    .get(newUrl) // Send GET request for starred repos
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
                        // console.log("API Call #2",data)
                        generateHTML(data);
                        writeHTML(generateHTML(data));
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
            <div class="container user-info-container">
            <!-- <div class="overlay01"></div>
                <section id="section01" class="demo">
                    <a href="#"><span></span></a>
                </section>-->
                <div class="user-info">
                    <h1 class="username">Hello, my name is ${data.username}</h1>
                    <h2 class="location">I am a developer located in ${data.location}</h2>
                </div>
                <div class="profile">
                    <img src="${data.img}" alt="" class="profile-img">    
                </div>
                
            </div>
        </header>

        <main>
            <div class="container">
                <div class="gallery">

                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>Public Repositories</p></div>
                        <h2 class="count rep-count">${data.repoNum}</h2>
                    </div>

                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>Followers</p></div>
                        <h2 class="count followers-count">${data.followers}</h2>
                    </div>
            
                    <div class="gallery-item" tabindex="0">
                        <div class="gallery-item-info"><p>GitHub Stars</p></div>
                        <h2 class="count stars-count">${data.starNum}</h2>
                    </div>
                    
                    <div class="gallery-item" tabindex="0">
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

const writeHTML = function(generateHTML){
    writeFileAsync("index.html", generateHTML);
    }
    
     promptUser();
    
     async function makePdf(username){
    
      try {
     
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
    //the page.goto path should be manually set to where the HTML you want to convert to .pdf lives
    
      await page.goto("file://C:/hildadubon/sites/ucla-projects/hw-7/Developer-Profile-Generator");
      await page.emulateMedia("screen");
      await page.pdf({
        path: `${username}.pdf`,
        format: "A4",
        printBackground:true,
        landscape:true
      });
      
      console.log("done");
      await browser.exit();
    } catch (error) {
    console.log("our error");
    }
    }


// async function init() {
//     // console.log("hi")
//     try {
//       const answers = await promptUser();
//       const repos = getRepoInfo(data)
//       const html = generateHTML(answers);

      
  
//       await writeFileAsync("index.html", html);
  
//       console.log("Successfully wrote to index.html");
//     } catch(err) {
//       console.log(err);
//     }
//   }
  
//   init();
    
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
