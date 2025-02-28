const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatCommentsData = (commentsData, articlesData) => {

  // we want an array of comments data objects now with article_id that matches to the title in article and article_title in comments

  const lookupObj = {};
  articlesData.forEach(
    ({ article_id, title }) => (lookupObj[title] = article_id)
  );
  const formattedCommentsData = commentsData.map((comment) => {
    const copyCommentObj = { ...comment };
    copyCommentObj.article_id = lookupObj[copyCommentObj.article_title];
    delete copyCommentObj.article_title;
    // console.log(copyCommentObj);
    const finalFormattedCommentsData = convertTimestampToDate(copyCommentObj);
    // console.log(finalFormattedCommentsData)
    return finalFormattedCommentsData;
  })
  return formattedCommentsData;
}



module.exports = { convertTimestampToDate, formatCommentsData };



