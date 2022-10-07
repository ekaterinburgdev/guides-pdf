export default async function (fastify, _) {
  fastify.get('/', async function (request, _) {
    console.log(process.env.PDF_PUBLIC_KEY)
    return `
      Микросервис на Fastify для получения pdf файлов руководств
      /guide/:имя_руководства — способ получить pdf файл нужного руководства
    `
  })
}
