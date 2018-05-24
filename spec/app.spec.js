const app = require("../app");
const { expect } = require("chai");
const mongoose = require("mongoose");
const seedDB = require("../seed/seed");
const request = require("supertest")(app);
const {topicData, userData, commentData, articleData} = require('../seed/testData')


describe("/", function() {
  this.timeout(5000)
  let articles, comments, topics, users;

  beforeEach(() => {
    return seedDB(topicData, userData, articleData, commentData)
    .then (docs => {
      comments = docs[0]
      topics = docs[1]
      articles = docs[2]
      users = docs[3]
    })
    .catch(console.log)
  });

  describe("/articles", () => {
    it("GET returns a 200 and the articles", () => {
      return request
        .get("/api/articles")
        .expect(200) 
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.keys('title', 'body', 'belongs_to', 'votes', 'created_by', '__v', '_id', 'comments')

        });
    });
});
describe("/articles/:article_id", () => {
  it("GET returns a 200 and the article", () => {
    return request
      .get(`/api/articles/${articles[0]._id}`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.article._id).to.equal(`${articles[0]._id}`);
        expect(res.body.article).to.have.keys('title', 'body', 'belongs_to', 'votes', 'created_by', '__v', '_id')
      });
  });
  // it("PUT returns a 202 and a message", () => {
  //   return request
  //     .get(`/api/articles/${articles[0]._id}`)
  //     .expect(200) 
  //     .then(res => {
  //       expect(res.body).to.be.an("object");
  //       expect(res.body.article._id).to.equal(`${articles[0]._id}`);
  //       expect(res.body.article).to.have.keys('title', 'body', 'belongs_to', 'votes', 'created_by', '__v', '_id')
  //     });
  // });
});
describe("/articles/:article_id/comments", () => {
  it("GET returns a 200 and all the comments for an individual article", () => {
    return request
      .get(`/api/articles/${articles[0]._id}/comments`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.comments.length).to.equal(2);
        expect(res.body.comments[0]).to.have.keys('created_by', 'body', 'belongs_to', 'votes', 'created_at', '__v', '_id')
      });
  });
  it("POST returns a 201 and the comment", () => {
    return request
      .post(`/api/articles/${articles[0]._id}/comments`)
      .send({'comment': 'This article is mint'})
      .expect(201) 
      .then(res => {
        expect(res.body.comment).to.be.an("object");
        expect(res.body.comment).to.have.keys('body', 'belongs_to', 'votes', 'created_at', '__v', '_id')
      });
  });
});

describe("/comments", () => {
  it("GET returns a 200 and the comments", () => {
    return request
      .get("/api/comments")
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.comments.length).to.equal(8);
        expect(res.body.comments[0]).to.have.keys('body', 'belongs_to', 'votes', 'created_at', 'created_by', '__v', '_id')
      });
  });
});
describe("/comments/:comment_id", () => {
//   it("PUT returns a 202 and the comment with new votes", () => {
//     return request
//       .get("/api/comments/:comment_id")
//       .expect(202) 
//       .then(res => {
//         expect(res.body).to.be.an("object");
//         expect(res.body.comments[0]).to.have.keys('body', 'belongs_to', 'votes', 'created_at', 'created_by', '__v', '_id')
//       });
//   });
    //  it("DELETE returns a 400 and an empty object", () => {
    //   return request
    //     .delete("/api/comments/:comment_id")
    //     .expect(400) 
    //     .then(res => {
    //       expect(res.body).to.be.an("object");
    //     });
    // });
});

describe("/topics", () => {
  it("GET returns a 200 and the topics", () => {
    return request
      .get("/api/topics")
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.topics.length).to.equal(2);
      });
  });
});

describe("/topics/:topic/articles", () => {
  it("GET returns a 200 and the articles for the requested topic", () => {
    return request
      .get(`/api/topics/cats/articles`)
      .expect(200) 
      .then(res => {
        expect(res.body.articles.length).to.equal(2);
        expect(res.body.articles[0].body).to.equal('Well? Think about it.')
        expect(res.body.articles[0]).to.have.keys('body', 'belongs_to', 'votes', 'title', 'created_by', '__v', '_id')

      });
  });
  it("POST returns a 201 and the added article", () => {
    return request
      .post(`/api/topics/${topics[0].slug}/articles`)
      .send({ "title": "this is my new article title", "body": "This is my new article content"})
      .expect(201) 
      .then(res => {
        expect(res.body.article).to.have.keys('body', 'belongs_to', 'votes', 'title', 'created_by', '__v', '_id')

      });
  });
});

describe("/users", () => {
  it("GET returns a 200 and the users", () => {
    return request
      .get("/api/users")
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.users.length).to.equal(2);
      });
  });
});
// describe("/users/:username", () => {
//   it("GET returns a 200 and the user", () => {
//     return request
//       .get("/api/users/:username")
//       .expect(200) 
//       .then(res => {
//         expect(res.body).to.be.an("object");
//         expect(res.body.users.length).to.equal(2);
//       });
//   });
//});

after(() => {
  return mongoose.disconnect();
});
})
  

