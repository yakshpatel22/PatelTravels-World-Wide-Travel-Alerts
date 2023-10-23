import got from "got";
const getJSONFromWWWPromise = (url) => {
  return new Promise((resolve, reject) => {
    got(url, { responseType: "json" })
      .then((response) => {
        let all = response.body;
        resolve(all);
      })
      .catch((err) => {
        console.log(`Error ==> ${err}`);
        reject(err);
      });
  });
};

export default getJSONFromWWWPromise;
