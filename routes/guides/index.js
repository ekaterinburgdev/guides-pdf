import fs from 'fs';
import { GUIDES_FOLDER } from '../../const.js';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  9

export default async function (fastify, _) {
  fastify.get('/', async function (request, _) {
    return {
      guides: fs.readdirSync(GUIDES_FOLDER),
    }
  })
}
