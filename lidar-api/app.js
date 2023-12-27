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

  data.forEach(element => {
    console.log('angle: ', element[1])
  });
  console.log('data length: ', data.length)

  const points = data.map((dataPoint) => { return convertToPoint(Number(dataPoint[1]), 0.0, Number(dataPoint[0])) })
  // console.log('points', points)
  
  console.log('adding to point cloud')
  poinCloud.push(...points)
  cloudSize += points.length



  return new Response('OK')
}
const handleLidarStop = async (request) => {
  exportToPly(poinCloud)
  poinCloud = []
  cloudSize = 0
  return new Response('OK')
}
const handleTest = async (request) => {
  cppPrint()
  return new Response(add(1, 2))
}
const handleGetPointClouds = async (request) => {
  const pointClouds = Deno.readDirSync('./pointClouds')
  const pointCloudsArray = []

  for (const pointCloud of pointClouds) {
    pointCloudsArray.push(pointCloud.name)
  }

  return new Response(JSON.stringify(pointCloudsArray))
}
const handleDownloadPointCloud = async (request, urlPatternResult) => {
  const name = urlPatternResult.pathname.groups.name
  const pointCloud = Deno.readFileSync(`./pointClouds/${name}`)
  return new Response(pointCloud, { headers: { 'Content-Type': 'application/octet-stream' } })
}
const handleLidarReset = async (request) => {
  poinCloud = []
  cloudSize = 0
  return new Response('OK')
}
const urlMapping = [
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/lidar' }),
    fn: handlePostRawLidarData
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/lidar/reset' }),
    fn: handleLidarReset
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/lidar/stop' }),
    fn: handleLidarStop
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
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/pointclouds' }),
    fn: handleGetPointClouds
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/pointcloud/:name' }),
    fn: handleDownloadPointCloud
  }
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