# General Description
Basic web scraper built using Node.js for the scraping itself and React for the front end.
Requests and endpoints are done through Express.js.

# Functionality
The web scraper allows a user to input a URL of site that they would like to scrape. The user is given a choice between what kind of information he would like to scrape through the use of simple checkboxes.
The choices provided are:
- images
- titles
- text
- links
- authors
- dates

Clciking on the scrape data button will show all the data found structured inside a table.
Under that there are options for the user to have the scraper count the total number of words found on the page, as well as put it through sentimental analysis to determine if the overall wording is positive, negative or neutral in nature.

# Endpoints
There are 3 endpoints. 

The first is reserved for the web scraping itself and is done through a POST request. The endpoint takes a json body with the link to the webpage, and options for the data that the user chooses to web scrape.
This endpoint uses if statements to sort out which data from the scraped page should be sent back in a json format back to the client/front.

The second endpoint is used for word counting. It works much like the first one but takes only the link to the page, which it then scans and runs a check with RegEx to determine how many words there are.

The final endpoint is used for the sentiment analysis. Has a basic algorithm based on checking for specific words and doing a count of them based on category. 
If there isn't too much difference between the amount of positives and negatives, it will be determined as neutral and so on.

# Notes
Quite a new thing for me to work with HTML tags themselves, was an interesting learning experience.
Choosing Puppeteer over Cheerio and Axios early on proved to be an important decision as it appeared simpler and more future-proof, was mostly done because the alternative couldn't really allow for good scraping of pages built in React or any other framework as far as I know.
Aside from that, implementing RegEx will likely be essential in the future, even if currently it wasn't a major point of this project. Also I tested out scraping multiple pages and will likely start on trying out automating them through a single operation in the near future.

# Installation
Both the front and the scraper are based on Node.js, so after downloading them it should be the classic npm init, npm install for both folders individually, after which npm start should be run.

# Showcase
https://github.com/Pavel-Gherciu/Web-Scraper/assets/62070101/015caa7a-a7af-4c2a-96c9-b6f01ad5894e

