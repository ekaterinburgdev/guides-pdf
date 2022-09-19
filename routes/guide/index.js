import { getTree, getAllUrls } from '../../api/notion-api.js';
import { createPdf } from '../../domain/pdf.js';

export default async function (fastify, opts) {
  fastify.get('/:params', async function (request, reply) {
    const tree = await getTree();
    const children = tree?.children;
    const allGuidesUrls = getAllUrls(children);
    const guideUrls = allGuidesUrls
      .filter(url => url[0] === request.params.params)
      .map(arr => arr.join('/'))
      .map(url => `https://guides.ekaterinburg.design/${url}`)
    createPdf(guideUrls, 'merge.pdf')

    return {
      guide: guideUrls,
    }
  })
}
