import { getTree, getAllUrls } from '../../notion-api/notion-api.js';
import { createPdf } from '../../utils/createPdf.js';

export default async function (fastify, _) {
  fastify.get('/:params', async function (request, _) {
    const tree = await getTree();
    const children = tree?.children;
    const allGuidesUrls = getAllUrls(children);
    // const guideUrls = allGuidesUrls
    //   .filter(url => url[0] === request.params.params)
    //   .map(arr => `http://localhost:8080/${arr.join('/')}`)
    const guideUrls = ['https://www.alpinelinux.org/', 'https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html']

    await createPdf(guideUrls, `merge`);

    return {
      guide: guideUrls,
    }
  })
}
