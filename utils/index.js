//make function to get new user id from reference obj - use username as key and new id as value
// const createUserRef = (userData, userDocs) => {
//   return userData.reduce((acc, userDatum, index) => {
//     acc[userDatum.username] = userDocs[index]._id;
//     return acc;
//   }, {});
// };

// const createArticleRef = (articleData, articleDocs) => {
//   return articleData.reduce((acc, articleDatum, index) => {
//     acc[articleDatum.title] = articleDocs[index]._id;
//     return acc;
//   }, {});
// };

// exports.formatArticleData = (articleData, userDocs, userData) => {
//   const userRef = createUserRef(userData, userDocs);

//   return articleData.map(articleDatum => {
//     return {
//       title: articleDatum.title,
//       body: articleDatum.body,
//       belongs_to: articleDatum.topic,
//       votes: 0,
//       created_by: userRef[articleDatum.created_by]
//     };
//   });
// };

// exports.formatCommentData = (commentData, userDocs, userData, articleDocs, articleData) => {
//   const userRef = createUserRef(userData, userDocs);
//   const articleRef = createTopicRef(articleData, articleDocs)

//   return commentData.map(CommentDatum => {
//     return {
//       body: CommentDatum.body,
//       belongs_to: articleRef[CommentDatum.belongs_to],
//       created_at: CommentDatum.created_at,
//       votes: CommentDatum.votes,
//       created_by: userRef[CommentDatum.created_by]
//     };
//   });
// };

//THIS ALSO WORKS AND IS WAY SHORTER ===
const {Comment} = require('../models')
exports.formatArticleData = (articlesData, userDocs) => {
  return articlesData.map(article => {
    return {
      ...article,
      belongs_to: article.topic,
      created_by: userDocs.find(user => user.username === article.created_by)
        ._id
    }
  })
 }
 
 exports.formatCommentData = (commentData, articleDocs, userDocs) => {
  return commentData.map(comment => {
    return {
      ...comment,
      belongs_to: articleDocs.find(
        article => article.title === comment.belongs_to
      )._id,
      created_by: userDocs.find(user => user.username === comment.created_by)
        ._id
    }
  })
 }

 exports.addCommentCount = (article) => {
  //console.log(article, "ArTICLE")
  return Comment.count({belongs_to: article._id})
  .then((commentCount) => {
      article.comments = commentCount
      return article
 })
 .catch((err) => {
   console.log(err.name, 'COMMENT error')
 })
}

// exports.addCommentCount = (article) => {
//   //console.log(article, "ArTICLE")
//   return Promise.all([Comment.count({belongs_to: article._id}), article])
//   .then(([commentCount, article]) => {
//       article.comments = commentCount
      
//       return article
//  })
//  .catch((err) => {
//    console.log(err.name, 'COMMENT error')
//  })
// }
