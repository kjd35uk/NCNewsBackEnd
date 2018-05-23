//make function to get new user id from reference obj - use username as key and new id as value
const createUserRef = (userData, userDocs) => {
  return userData.reduce((acc, userDatum, index) => {
    acc[userDatum.username] = userDocs[index]._id;
    return acc;
  }, {});
};

// const createTopicRef = (topicData, topicDocs) => {
//   return topicData.reduce((acc, topicDatum, index) => {
//     acc[topicDatum.slug] = topicDocs[index]._id;
//     return acc;
//   }, {});
// };

exports.formatArticleData = (articleData, userDocs, userData) => {
  const userRef = createUserRef(userData, userDocs);
  //const topicRef = createTopicRef(topicData, topicDocs)

  return articleData.map(articleDatum => {
    return {
      title: articleDatum.title,
      body: articleDatum.body,
      belongs_to: articleDatum.topic,
      votes: 0,
      created_by: userRef[articleDatum.created_by]
    };
  });
};
