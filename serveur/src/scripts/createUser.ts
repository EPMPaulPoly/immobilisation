import { auth } from "../lib/auth";
import {pool} from "../lib/poolCreate";
import config from "../config";
// Database connection

async function createFirstUser() {
  console.log(config.database);
  const res = await auth.api.signUpEmail({
      body:{
        email:"admin@test.com",
        password: 'admin123',
        name:"Admin Test"
      }
    }
);
  console.log(res);
}

createFirstUser();
