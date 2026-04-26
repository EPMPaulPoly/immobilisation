import { Pool } from "pg";
import { betterAuth } from "better-auth";
import {pool} from "./poolCreate";
import { admin } from 'better-auth/plugins'
import { apiKey } from '@better-auth/api-key'

export const auth = betterAuth({
    database: pool,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/",
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword:{
        enabled:true,
    },
    trustedOrigins:["http://localhost:3000"],
    plugins:[
        admin(),
        apiKey()
    ]
});
