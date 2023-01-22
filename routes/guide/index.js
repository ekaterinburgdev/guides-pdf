import { getTree, getAllUrls } from '../../notion-api/notion-api.js';
import { createPdf } from '../../utils/createPdf.js';
import { GUIDES_FOLDER } from '../../const.js';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  9

const GUIDES_URL = "https://guides.ekaterinburg.io/";

export default async function (fastify, _) {
  fastify.get('/:params', async function (request, _) {
    const tree = await getTree();
    const children = tree?.children;
    const allGuidesUrls = getAllUrls(children);
    const guideUrls = allGuidesUrls
      .filter(url => url[0] === request.params.params)
      .map(arr => `${GUIDES_URL}${arr.join('/')}`);

    if (guideUrls.length > 0){
      createPdf(guideUrls, [GUIDES_FOLDER, `${request.params.params}.pdf`].join('/'));
    }

    return {
      guide: guideUrls,
    }
  })
}
