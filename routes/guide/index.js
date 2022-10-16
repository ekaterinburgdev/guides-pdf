import { getTree, getAllUrls } from '../../notion-api/notion-api.js';
import { createPdf } from '../../utils/createPdf.js';

export default async function (fastify, _) {
  fastify.get('/:params', async function (request, _) {
    const tree = await getTree();
    const children = tree?.children;
    const allGuidesUrls = getAllUrls(children);
    const guideUrls = allGuidesUrls
      .filter(url => url[0] === request.params.params)
      .map(arr => `https://guides.ekaterinburg.design/${arr.join('/')}`)

    await createPdf(guideUrls, `merge`)

    return {
      guide: guideUrls,
    }
  })
}
