import got from 'got' 

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const tree = await got('http://guides-api-test.ekaterinburg.design:48700/api/tree').json()
    const children = tree?.children;
    console.log(children);
    for (const i in tree) {
      if (Array.isArray(tree[i])) {
        const allGuidesUrls = tree[i].map(i => i.properties.pageUrl.url)
        const hello = JSON.stringify(
          await got(`http://guides-api-test.ekaterinburg.design:48700/api/content/root/${allGuidesUrls[0]}`).json()
        );
        console.log(hello);
      };
    }
    return { root: tree }
  })
}
