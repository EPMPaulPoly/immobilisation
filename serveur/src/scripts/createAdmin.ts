import { auth } from "../lib/auth";
import config from "../config";
// Database connection

async function createFirstAdmin() {
  console.log(config.database);
  const res = await auth.api.createUser({
      body:{
        email:"admin@test.com",
        password: 'admin123',
        name:"Admin Test",
        role:'admin'
      }
    }
);
  console.log(res);
}

createFirstAdmin();
