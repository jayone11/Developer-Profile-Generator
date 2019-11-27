# Developer-Profile-Generator
A command-line application that dynamically generates a PDF profile from a GitHub username. The application will be invoked with the following command:

![](app.gif)

```sh
node index.js
```

The user will be prompted for a favorite color, which will be used as the background color for cards.

The PDF will be populated with the following:

* Profile image
* user name
* Links to the following:
  * User location via Google Maps
  * User GitHub profile
  * User blog
* User bio
* Number of public repositories
* Number of followers
* Number of GitHub stars
* Number of users following
