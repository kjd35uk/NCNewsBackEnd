**Northcoders News**
Northcoders News is a social news aggregation, web content rating, and discussion website. In a similar way to Reddit, Northcoders News has articles which are organised into topics. Users have the opportunity to rate articles by using a voting system - articles can be up or down voted using the API. It is also possible to add comments about an article. As with articles, comments can  be up or down voted. A user may add comments to an article or remove any previously added comments, although it is not possible to delete comments made by other users. The API for Northcoders News is a RESTful API which has been developed using Node.js, Express.js, MongoDB and Mongoose. 

The repo containing the source code for this API is also available from https://github.com/kjd35uk/BE-FT-northcoders-news.

**Getting Started**
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

**Installation Instructions**
You will need to install Node.js at version 7.9.0 on your local machine to run Northcoders News. See deployment for notes on how to deploy the project on a live system.

**Node**
Type the command below to check whether you already have node installed:

$ node -v

If node is already installed, the output of the command will display the version (e.g. v7.9.0). If you need to install node, please follow this link (http://nodejs.org/en/).

**MongoDB**
If you need to install MongoDB, please follow this link:-(https://docs.mongodb.com/manual/installation/)

**Install Northcoders News**
Please clone the repository https://github.com/kjd35uk/BE-FT-northcoders-news

$ git clone https://github.com/kjd35uk/BE-FT-northcoders-news

To install all dependencies, please enter the following commands into the terminal:-

$ cd northcoders-news $ npm install

Open another terminal window and start the MongoDB deamon with the following command:- (N.B. on Ubuntu systems you may need to be superuser)

$ mongod

Return to your original terminal window and type the following commands:-

$ npm run seed:dev $ npm run dev

Once you have done this, the API will be available on http://localhost:9090 via your web browser.

The API and all of its endpoints have been fully tested. To run the test suite, please enter the following command into the terminal:-

$ npm test.

**Test Suite**
To run the test suite please enter the following command into the terminal

$ npm test

**Routes**
| Route                         |                                              |
| -------------                 |   -------------                              |
| GET /api/topics               | Gets all the topics                          | 
| GET                           | Returns all the articles for a               |
|  /api/topics/:topic/articles  | certain topic                                |
| POST                          | Adds a new article to a topic. This route    |
|   /api/topics/:topic/articles | requires a JSON body with title and body     | |                               | properties e.g: { "title": "this is          |
|                               | my new article title", "body": "This is      |
|                               | my new article content"}                     |
| GET /api/articles             | Gets all the articles                        |
| GET /api/articles/:article_id | Gets an individual article                   |
| GET /api/articles/:article_id/| Gets all comments for an individual          |
|   comments                    | article                                      | 
| POST                          | Adds a new comment to an article. This       |
|  /api/articles/:article_id/   | route requires a JSON body with a comment    |
|  comments                     | property e.g:                                |
|                               | {"comment": "This is my new comment"}        |
| PUT /api/articles/:article_id | Increments or decrements the votes of an     | |                               | article by one. This route requires a vote   |
|                               | query of 'up' or 'down' e.g:                 | 
|                               | https://northcoders-news-kirstiecodes.       |
|                               | herokuapp.com/api/articles/:article_id?      |
|                               | vote=up                                      |
| GET /api/comments             | Gets all the comments                        |
| GET /api/comments/:comment_id | Gets an individual comment                   |
| PUT /api/comments/:comment_id | Increments or decrements the votes of a      | |                               | comment by one. This route requires a vote   |
|                               | query of 'up' or 'down' e.g:                 | |                               | https://northcoders-news-kirstiecodes.       |
|                               | herokuapp.com/api/articles/:article_id?      | |                               | vote=down                                    |
| DELETE                        | Deletes a comment if it was created by the   | |  /api/comments/:comment_id    | Northcoder user                              |
| GET /api/users/               | Gets all the users                           |
| GET /api/users/:username      | Returns a JSON object with the profile data  | |                               | for the specified user                       |


**Deployment**
If you would like to run the production deployed API without installing the software onto your computer, open a browser window and enter the following url:

https://northcoders-news-kirstiecodes.herokuapp.com

e.g. https://northcoders-news-kirstiecodes.herokuapp.com/api/articles will return all articles in the database. Please refer to the table above for a list of all available routes.

**Authors**
Kirstie Davidson