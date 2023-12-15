import { getTree, getAllUrls } from '../../notion-api/notion-api.js';
import { createPdf } from '../../utils/createPdf.js';
import { GUIDES_FOLDER } from '../../const.js';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  9

const GUIDES_URL = "https://guides.ekaterinburg.io/";

const PAGES_TO_IGNORE = ['_index', 'general', 'general-provisions', 'module-1'];

export default async function (fastify, reply) {
  fastify.get('/:params', async function (request, reply) {
    const tree = await getTree();
    const children = tree?.children;
    const allGuidesUrls = getAllUrls(children);
    const guideUrls = allGuidesUrls
      .filter(url => url[0] === request.params.params && !PAGES_TO_IGNORE.includes(url[url.length - 1]))
      .map(arr => `${GUIDES_URL}${arr.join('/')}`);

    if (guideUrls.length === 0){
      return fastify.notFound(request, reply)
    }

    createPdf(guideUrls, [GUIDES_FOLDER, `${request.params.params}.pdf`].join('/'));
    
    return {
      guide: guideUrls,
    }
  })
}
