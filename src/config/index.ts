import dotenv from "dotenv";
dotenv.config();

const GOOGLECLIENTID = process.env.GOOGLE_CLIENT_ID;
const GOOGLECLIENTSECRET = process.env.GOOGLE_SECRET_API_KEY;
const GOOGLEREDIRECTURL = process.env.GOOGLE_REDIRECT_URI;
const DBURL = process.env.DBURL;
const STRIPE_SIGNING_SECRET = process.env.STRIPE_SIGNING_SECRET;
const SALT = process.env.ROUNDS;
const JWT_KEY = process.env.JWT_KEY;
const USER = process.env.USER_for_Email;
const PASS = process.env.PASS;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const PORT = process.env.PORT;
const PRODUCTION = process.env.PRODUCTION;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const PRODUCTION_FRONTEND_URL = process.env.PRODUCTION_FRONTEND_URL;
const CLIENT_ID_NodeMailer = process.env.client_id_NodeMailer;
const CLIENT_SECRET_NodeMailer = process.env.client_secret_NodeMailer;
const REFRESH_TOKEN = process.env.refresh_token;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const LS_SIGNATURE_SECRET = process.env.LS_SIGNATURE_SECRET;
const LS_API_KEY = process.env.LS_API_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const isS3 = process.env.isS3 ? process.env.isS3 : false;

const config = {
  GOOGLECLIENTID,
  GOOGLECLIENTSECRET,
  GOOGLEREDIRECTURL,
  DBURL,
  STRIPE_SIGNING_SECRET,
  SALT,
  JWT_KEY,
  USER,
  PASS,
  CLOUD_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  PORT,
  PRODUCTION,
  BACKEND_BASE_URL,
  PRODUCTION_FRONTEND_URL,
  CLIENT_ID_NodeMailer,
  CLIENT_SECRET_NodeMailer,
  REFRESH_TOKEN,
  STRIPE_SECRET_KEY,
  LS_SIGNATURE_SECRET,
  LS_API_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  isS3,
};


export default config;

