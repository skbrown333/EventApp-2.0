import { logger as log } from "./logging";
import jwt from "jsonwebtoken";

export function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export function handleError(error, req, res, next) {
  log.error(error.message);
  res.status(500).json({ message: error.message, status: error.status });
}

export function getCleanAccount(account) {
  return {
    _id: account._id,
    first_name: account.first_name,
    last_name: account.last_name,
    email: account.email,
    cre_date: account.cre_date
  };
}

export function generateToken(account) {
  let token;
  if (!account) return null;
  let u = {
    first_name: account.first_name,
    last_name: account.last_name,
    email: account.email,
    _id: account._id.toString()
  };
  return (token = jwt.sign(u, process.env.JWT_SECRET));
}