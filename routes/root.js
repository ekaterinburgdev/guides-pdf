export default async function (fastify, _) {
  fastify.get('/', async function (request, _) {
    // console.log(process.env.PDF_PUBLIC_KEY)
    return `
      Микросервис на Fastify для получения pdf файлов руководств
      GET /guide/:имя_руководства — создание pdf'ки нужного руководства
      GET /guides/ - получить список уже существующих pdf руководств ( ответ в формате {"guides": ["guide1.pdf", "guide2.pdf"]} )
      GET /guides/guide_name.pdf - получить руководство в pdf формате
    `
  })
}
