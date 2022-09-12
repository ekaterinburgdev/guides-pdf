'use strict'

import got from 'got' 

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const response = await got('http://guides-api-test.ekaterinburg.design:48700/api/tree')
    return { root: response.body }
  })
}
