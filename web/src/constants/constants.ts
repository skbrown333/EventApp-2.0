/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env:any = {};
env.base_url = isLocal ? "http://localhost:3000" : "http://localhost:3000";
env.isLocal = isLocal;

export const ENV = env;

/**
 * COOKIES
 */

 export const COOKIES = {
   token: "pr_jwt"
 }

 export const MAP = {
   default_location: {
    lat: 43.079,
    lng: -89.386408
  }
 };