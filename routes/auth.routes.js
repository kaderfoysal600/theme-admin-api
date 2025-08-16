// /routes/auth.routes.js

import express from 'express';
import { adminSignup, adminLogin } from '../controllers/auth.controller.js';
import { checkDuplicateEmail } from '../middlewares/verifySignUp.js';
import { verifyToken } from "../middlewares/authJwt.js";
const router = express.Router();
router.post(
  "/signup",
  adminSignup
);

router.post(
  "/signin",
  adminLogin
);

// Use the default export for the router
export default router;