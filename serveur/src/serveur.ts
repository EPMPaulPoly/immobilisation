import express ,{Application,Request, Response}from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import { createApiRouter } from './api/routes';
import config from './config';
import listEndpoints from 'express-list-endpoints';
import {auth} from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import {pool} from './lib/poolCreate';


// Create Express app
const app = express();
const port = config.server.port;

// Middleware for cors
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// add better-auth middleware for auth routes
app.all("/api/auth/*",toNodeHandler(auth));

// Move JSON middleware after auth middle ware to ensure auth routes are processed first
app.use(express.json({ limit: '10mb' }));

// Routes for actual queries
app.use('/api', createApiRouter(pool));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Server user info:${config.database.user}`)
  console.log(`Server pwd: ${config.database.password}`)
  console.log(`Server address info:${config.database.host}`)
  console.log(`Server database info:${config.database.database}`)
  console.log(`Server running at ${new Date().toISOString()}`); 
  let client
  try{
    client = await pool.connect()
    const query = "SELECT tablename,tableowner FROM pg_catalog.pg_tables WHERE schemaname='public';"
    const result = await client.query(query)
    console.log('Requête de validation paramètres db a réussi!!!! La bd contient les tables suivantes:\n',result.rows)
  }catch(error:any){
    console.error('Erreur rencontrée lors de la connexion. Vérifiez paramètres de connexion\n',error)
  }finally{
    if(client){
      client.release()
    }
  }
});

type RouteInfo = {
  path: string;
  methods: string[];
  middlewares: string[];
};

export function extractRoutes(app: Application): RouteInfo[] {
  return extractRoutesFromStack((app._router?.stack ?? []), '');
}

function extractRoutesFromStack(stack: any[], prefix: string= ''): RouteInfo[] {
  const routes: RouteInfo[] = [];

  for (const layer of stack) {
    if (layer.route) {
      const path = prefix + layer.route.path;
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      const middlewares = layer.route.stack
        .map((mw: any) => mw.name || '<anonymous>')
        .filter((name: string) => name !== '<anonymous>');

      routes.push({ path, methods, middlewares });
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const mountPath = extractMountPath(layer);
      const newPrefix = prefix + mountPath;
      const childRoutes = extractRoutesFromStack(layer.handle.stack, newPrefix);
      routes.push(...childRoutes);
    }
  }

  return routes;
}

function extractMountPath(layer: any): string {
  if (layer.regexp && layer.regexp.source) {
    const match = layer.regexp.source.match(/\\\/([^\\]+)(?=\\\/\?\(\?=\\\/\|\$\))/);
    if (match) return '/' + match[1];
  }
  return '';
}


app.get('/api/routes', (req:Request, res:Response) => {
  const allRoutes = extractRoutes(app);
  res.json(allRoutes);
});


// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  pool.end();
  process.exit(0);
});