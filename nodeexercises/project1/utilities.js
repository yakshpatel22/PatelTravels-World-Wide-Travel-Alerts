import got from "got";
import { promises as fsp } from "fs";

const getJSONFromWWWPromise = async (url) => await got(url).json();

export { getJSONFromWWWPromise };
