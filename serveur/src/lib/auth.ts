import { Pool } from "pg";
import { betterAuth } from "better-auth";
import {pool} from "./poolCreate";

export const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
});
