import * as jwt from "jsonwebtoken";
const BigCommerce = require("node-bigcommerce");
require("dotenv").config();

export const {
  API_URL,
  AUTH_CALLBACK,
  CLIENT_ID,
  CLIENT_SECRET,
  JWT_KEY,
  LOGIN_URL,
} = process.env;

export const bigcommerce = new BigCommerce({
  logLevel: "info",
  clientId: CLIENT_ID,
  secret: CLIENT_SECRET,
  callback: AUTH_CALLBACK,
  responseType: "json",
  headers: { "Accept-Encoding": "*" },
  apiVersion: "v3",
});

export function getBCAuth(query) {
  return bigcommerce.authorize(query);
}

export function getBCVerify({ signed_payload_jwt }) {
  // const bigcommerceSigned = new BigCommerce({
  //     secret: CLIENT_SECRET,
  //     responseType: 'json',
  // });
  return bigcommerce.verifyJWT(signed_payload_jwt);
}

export function encodePayload({ user, owner, ...session }) {
  if (!session) {
    return;
  }
  const contextString = session.context ? session.context : session.sub;
  const context = contextString.split("/")[1] || "";

  return jwt.sign({ context, user, owner }, JWT_KEY, { expiresIn: "24h" });
}

export const buildRedirectUrl = (url, encodedContext) => {
  const [path, query = ""] = url.split("?");
  const queryParams = new URLSearchParams(`context=${encodedContext}&${query}`);

  return `${path}?${queryParams}`;
};
