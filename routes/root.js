export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return `
      Микросервис на Fastify для получения pdf файлов руководств
      /guide/:имя_руководства — способ получить pdf файл нужного руководства
    `
  })
}
