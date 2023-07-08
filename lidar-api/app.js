import { serve, convertToPoint, cppPrint, add } from "./deps.js";
import { exportToPly } from "./util/pointCloudUtils.js";

let cloudSize = 0
let poinCloud = []

const handlePostRawLidarData = async (request) => {
  const body = await request.json()
  // console.log('body', body)
  const { data } = body
  // const firstPoint = data[0]
  // //test the cpp library
  // const result = convertToPoint(Number(firstPoint[1]), 0.0, Number(firstPoint[0]))
  // console.log('firstPoint', firstPoint)
  // console.log('result', result)

  const points = data.map((dataPoint) => { return convertToPoint(Number(dataPoint[1]), 0.0, Number(dataPoint[0])) })
  // console.log('points', points)
  
  if (cloudSize < 1000){ 
    console.log('adding to point cloud')
    poinCloud.push(...points)
    cloudSize += points.length
  } else {
    console.log('exporting to ply')
    exportToPly(poinCloud)
    poinCloud = []
    cloudSize = 0
  }


  return new Response('OK')
}
const handleTest = async (request) => {
  cppPrint()
  return new Response(add(1, 2))
}
const urlMapping = [
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/lidar' }),
    fn: handlePostRawLidarData
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/health' }),
    fn: async () => new Response('OK')
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/test' }),
    fn: handleTest
  },
]

const handleRequest = async (request) => {
  try {
    console.log('request', request.method, request.url)
    const mapping = urlMapping.find(
      (um) => um.method === request.method && um.pattern.test(request.url)
    )

    if (!mapping) {
      return new Response('Not found', { status: 404 })
    }

    const mappingResult = mapping.pattern.exec(request.url)
    return await mapping.fn(request, mappingResult)
  } catch (error) {
    console.log(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

const portConfig = { port: 7777, hostname: '0.0.0.0' }
serve(handleRequest, portConfig)