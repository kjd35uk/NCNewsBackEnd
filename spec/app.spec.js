const app = require("../app");
const { expect } = require("chai");
const mongoose = require("mongoose");
const seedDB = require("../seed/seed");
const request = require("supertest")(app);
const {topicData, userData, commentData, articleData} = require('../seed/testData')


describe("/", function() {
  this.timeout(8000)
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
    it('GET returns 404 and error message when user enters an invalid route', () => {
      return request
        .get('/api/prettydogs')
        .expect(404)
        .then(res => {
          expect(res.body).to.eql({ msg: 'Page not found' });
        })
    })
});
describe("/articles/:article_id", () => {
  it("GET returns a 200 and the article", () => {
    return request
      .get(`/api/articles/${articles[0]._id}`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.article._id).to.equal(`${articles[0]._id}`);
        expect(res.body.article).to.have.keys('title', 'body', 'belongs_to', 'votes', 'created_by', '__v', '_id', 'comments')
      });
  });
  it('GET returns a 404 and a message when passed an article that does not exist', () => {
    return request
      .get(`/api/articles/${users[0]._id}`)
      .expect(404)
      .then(response => { 
         expect(response.body.msg).to.equal(`article ${users[0]._id} could not be found`);
      })
  })
  it('GET returns a 400 and a message when passed a malformed article id', () => {
    return request
      .get(`/api/articles/ab0a6edb33afdb4621136b27`)
      .expect(400)
      .then(response => { 
         expect(response.body.msg).to.equal(`bad request: ab0a6edb33afdb4621136b27 is not a valid article id`);
      })
  })
  it("PUT returns a 202 and the updated article after incrementing the vote when passed an existing article id", () => {
    return request
      .put(`/api/articles/${articles[0]._id}?vote=up`)
      .expect(202) 
      .then(res => {
        expect(res.body.article).to.have.keys('votes', '_id', 'title', 'created_by', 'body', 'belongs_to', '__v', 'comments');
        expect(res.body.article.votes).to.equal(1);
      });
  });
  it("PUT returns a 400 and a bad request message when user enters a malformed article id", () => {
    return request
      .put(`/api/articles/cat?vote=up`)
      .expect(400) 
      .then(res => {
        expect(res.body.msg).to.equal(`bad request: cat is not a valid article id`)
      });
  });
  it("PUT returns a 404 and a message when user enters a non-existent article", () => {
    return request
      .put(`/api/articles/${users[0]._id}?vote=up`)
      .expect(404) 
      .then(res => {
        expect(res.body.msg).to.equal(`article ${users[0]._id} cannot be found. Your vote has not been added`)
      });
  });
  it("PUT returns a 400 and a message when user enters something other than up or down", () => {
    return request
      .put(`/api/articles/${articles[0]._id}?vote=cat`)
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : 'Please enter up or down'});
      });
  });
});
describe("/articles/:article_id/comments", () => {
  it("GET returns a 200 and all the comments for an individual article when passed an existing article id", () => {
    return request
      .get(`/api/articles/${articles[0]._id}/comments`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.comments.length).to.equal(2);
        expect(res.body.comments[0]).to.have.keys('created_by', 'body', 'belongs_to', 'votes', 'created_at', '__v', '_id')
      });
  });
  it("GET returns a 404 and a message when passed a non-existent article id", () => {
    return request
      .get(`/api/articles/${users[0]._id}/comments`)
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `article ${users[0]._id} could not be found`});
      });
  });
  it("GET returns a 400 and a message when passed a malformed article id", () => {
    return request
      .get(`/api/articles/ab0a6edb33afdb4621136b27/comments`)
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : 'bad request: ab0a6edb33afdb4621136b27 is not a valid article id'})
  });
});
  it("POST returns a 201 and the comment when passed an existing article id", () => {
    return request
      .post(`/api/articles/${articles[0]._id}/comments`)
      .send({'comment': 'This article is mint'})
      .expect(201) 
      .then(res => {
        expect(res.body.comment).to.be.an("object");
        expect(res.body.comment).to.have.keys('created_by','body', 'belongs_to', 'votes', 'created_at', '__v', '_id')
      });
  });
  it("POST returns a 400 and a bad request message when user enters a malformed article id", () => {
    return request
      .post(`/api/articles/ab0a6edb33afdb4621136b27/comments`)
      .send({'comment': 'This article is mint'})
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : `bad request: ab0a6edb33afdb4621136b27 is not a valid article id`});
      });
  });
  it("POST returns a 404 and a message when user enters a non-existent article id", () => {
    return request
      .post(`/api/articles/${users[0]._id}/comments`)
      .send({'comment': 'This article is mint'})
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `article ${users[0]._id} cannot be found. Your comment has not been added`});
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
  it("GET returns a 200 and the comment when passed an existing comment id", () => {
    return request
      .get(`/api/comments/${comments[0]._id}`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.comment).to.have.keys('body', 'belongs_to', 'votes', 'created_at', 'created_by', '__v', '_id')
      });
  });
  it("GET returns a 400 and a bad request message when passed a malformed comment id", () => {
    return request
      .get(`/api/comments/ab0a7e7297f0f94ac37db875`)
      .expect(400) 
      .then(res => {
        expect(res.body.msg).to.equal("bad request: ab0a7e7297f0f94ac37db875 is not a valid comment id");
      });
  });
  it("GET returns a 404 and a page not found message when passed a non-existent comment id", () => {
    return request
      .get(`/api/comments/${users[0]._id}`)
      .expect(404) 
      .then(res => {
        expect(res.body.msg).to.equal(`comment ${users[0]._id} not found`);
      });
  });

  it("PUT returns a 202 and the comment with new votes when passed an existing comment id", () => {
    return request
      .put(`/api/comments/${comments[0]._id}?vote=up`)
      .expect(202) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.comment).to.have.keys('body', 'belongs_to', 'votes', 'created_at', 'created_by', '__v', '_id')
      });
  });
  it("PUT returns a 400 and a message when user enters something other than up or down", () => {
    return request
      .put(`/api/comments/${comments[0]._id}?vote=cat`)
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : 'Please enter up or down'});
      });
  });
  it("PUT returns a 404 and a not found message when user enters a non-existent comment id", () => {
    return request
      .put(`/api/comments/${users[0]._id}?vote=up`)
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `${users[0]._id} not found`});
      });
  });
  it("PUT returns a 400 and a bad request message when user enters a malformed comment id", () => {
    return request
      .put(`/api/comments/ab0a7e7297f0f94ac37db875?vote=up`)
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : `bad request: ab0a7e7297f0f94ac37db875 is not a valid comment id`});
      });
  });
     it("DELETE returns a 204 and an empty object when passed an existing comment id", () => {
      return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(204) 
        .then(res => {
          expect(res.body).to.be.an("object");
        });
    });
    it("DELETE returns a 404 when user enters a non-existent comment id", () => {
      return request
        .delete(`/api/comments/${users[0]._id}`)
        .expect(404) 
        .then(res => {
          expect(res.body).to.eql({msg : `Comment ${users[0]._id} not found`});
        });
    });
    it("DELETE returns a 400 when user enters a malformed comment id", () => {
      return request
        .delete(`/api/comments/ab0a7e7297f0f94ac37db875`)
        .expect(400) 
        .then(res => {
          expect(res.body).to.eql({msg : `bad request: ab0a7e7297f0f94ac37db875 is not a valid comment id`});
        });
    });
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
  it("GET returns a 200 and the articles for the topic when passed an existing topic name", () => {
    return request
      .get(`/api/topics/cats/articles`)
      .expect(200) 
      .then(res => {
        expect(res.body.articles.length).to.equal(2);
        expect(res.body.articles[0].body).to.equal("Well? Think about it.")
        expect(res.body.articles[0]).to.have.keys('body', 'belongs_to', 'votes', 'title', 'created_by', '__v', '_id', 'comments')
      });
  });
  it("GET returns a 400 and a message when user enters an invalid topic name", () => {
    return request
      .get(`/api/topics/1234/articles`)
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : `bad request: 1234 is not a string`});
      });
  });
  it("GET returns a 404 and a message when user enters a non-existent topic name", () => {
    return request
      .get(`/api/topics/dogs/articles`)
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `dogs not found`});
      });
  });
  it("POST returns a 201 and the added article when passed an existing topic name ", () => {
    return request
      .post(`/api/topics/${topics[0].slug}/articles`)
      .send({ "title": "this is my new article title", "body": "This is my new article content"})
      .expect(201) 
      .then(res => {
        expect(res.body.article).to.have.keys('body', 'belongs_to', 'votes', 'title', 'created_by', '__v', '_id', 'comments')

      });
  });
  it("POST returns a 400 and a message when user enters an invalid topic name", () => {
    return request
      .post(`/api/topics/1234/articles`)
      .send({ "title": "this is my new article title", "body": "This is my new article content"})
      .expect(400) 
      .then(res => {
        expect(res.body).to.eql({msg : `bad request: 1234 is not a string`});
      });
  });
  it("POST returns a 404 and a message when user enters a non-existent topic name", () => {
    return request
      .post(`/api/topics/dogs/articles`)
      .send({ "title": "this is my new article title", "body": "This is my new article content"})
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `topic dogs cannot be found`});
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
describe("/users/:username", () => {
  it("GET returns a 200 and the user", () => {
    return request
      .get(`/api/users/${users[0]._id}`)
      .expect(200) 
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.user).to.have.keys('username', 'name', 'avatar_url', '__v', '_id')
      });
  });
  it("GET returns a 404 a message when user enters a non-existent user id", () => {
    return request
      .get(`/api/users/1234`)
      .expect(404) 
      .then(res => {
        expect(res.body).to.eql({msg : `1234 not found`});
      });
  });
});

after(() => {
  return mongoose.disconnect();
});
})
  

