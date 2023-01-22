import { join } from 'path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { GUIDES_FOLDER } from './const.js';
import fastifyStatic from '@fastify/static';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (fastify, opts) {
  // Place here your custom code!

  if (!fs.existsSync(GUIDES_FOLDER)) {
    fs.mkdirSync(GUIDES_FOLDER, { recursive: true });
  };
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });

  fastify.register(fastifyStatic, {
    root: join(__dirname, GUIDES_FOLDER),
    prefix: '/guides/',
  });

  fastify.decorate('notFound', (request, reply) => {
    reply.code(404).type('text/html').send('Not Found')
  })
  
  fastify.setNotFoundHandler(fastify.notFound);
}
