import * as fastify from 'fastify'
import fastifySwagger from 'fastify-swagger'


const server: fastify.FastifyInstance = fastify.fastify({ logger: true })

// fastifySwaggerを動かす最低限の実装
server.register(fastifySwagger, {
  routePrefix: '/docs',
  openapi: {
    servers: [ { url : "http://127.0.0.1:3000/" } ],
  },
  exposeRoute: true,
})
server.register(require('fastify-cors'), { 
  // put your options here
})

server.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' }
})


// queryとresponseのschemaを定義する
const schema1: fastify.RouteShorthandOptions = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        test_query: {
          type: 'number',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          test_response: {
            type: 'number'
          },
        },
      },
    },
  },
}
// デフォルトだとqueryのTSとしての型定義がunknownなので、定義してあげる
interface Request1 extends fastify.RequestGenericInterface {
  Querystring: {
    test_query: number
  }
}
server.get<Request1, unknown, fastify.FastifySchema>('/querytest', schema1, async (request, reply) => {
  return { test_response: request.query.test_query }
})


// paramsとresponseのschemaを定義する
const schema2: fastify.RouteShorthandOptions = {
  schema: {
    params: {
      type: 'object',
      properties: {
        test_param: {
          type: 'string',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          test_response2: {
            type: 'string'
          },
        },
      },
    },
  },
}
// デフォルトだとParamsのTSとしての型定義がunknownなので、定義してあげる
interface Request2 extends fastify.RequestGenericInterface {
  Params: {
    test_param: string
  }
}

server.get<Request2, unknown, fastify.FastifySchema>('/paramstest/:test_param', schema2, async (request, reply) => {
  return { test_response2: request.params.test_param }
})

server.listen(3000)
