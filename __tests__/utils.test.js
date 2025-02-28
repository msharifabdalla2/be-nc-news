const {
  convertTimestampToDate,
  formatCommentsData,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});
// describe.only("formatCommentsData function", () => {
//   test("When an array with a single object is passed to formatCommentsData along with the articles data, it will return a new copy of comments data but with article_title deleted and will instead have a park id", () => {
//     const articlesData = [
//       {
//         article_id: 1,
//         title: "Living in the shadow of a great man",
//         topic: "mitch",
//         author: "butter_bridge",
//         body: "I find this existence challenging",
//         created_at: 1594329060000,
//         votes: 100,
//         article_img_url:
//           "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
//       }
//     ];
//     const commentsData = [
//       {
//         comment_id: 1,
//         article_title: "They're not exactly dogs, are they?",
//         body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
//         votes: 16,
//         author: "butter_bridge",
//         created_at: 1586179020000,
//       },
//     ]

//     const result = formatCommentsData(input);
//     expect(result).toEqual({
//       "Living in the shadow of a great man": 1
//     });
//   })  
// })

