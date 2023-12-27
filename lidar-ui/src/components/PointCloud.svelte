<script>
  import { onMount } from 'svelte';
  import ScatterPlot from './ScatterPlot.svelte';

  let points = [];
  let pointcloudFile = 'example_cloud.ply';

  async function fetchPointCloud(pointcloudFile) {
    try {
      const response = await fetch(`/api/pointcloud/${pointcloudFile}`);
      const data = await response.text();
      //console.log('Fetched point cloud:', data);
      const rawPoinst = parsePly(data);

      return rawPoinst.map((point) => {
        return {
          x: point[0] / 1000,
          y: point[1] / 1000,
          z: point[2] / 1000,
        };
      });
      
      return rawPoinst;
    } catch (error) {
      console.error('Failed to fetch point cloud:', error);
    }
  }

  async function fetchPointClouds() {
    try {
      const response = await fetch('/api/pointclouds');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch point cloud:', error);
    }
  }

  function parsePly(data) {
    const lines = data.split("\n");

    // Find the index where "end_header" appears
    const endHeaderIndex = lines.indexOf("end_header");

    // Extract the vertex data
    const vertexLines = lines.slice(endHeaderIndex + 1);

    const vertices = [];
    for (const line of vertexLines) {
      const vertex = line.split(" ");
      if (vertex.length === 3) {
        vertices.push([parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2])]);
      }
    }

    return vertices;
  }

  let pointclouds = fetchPointClouds();

  $: points = fetchPointCloud(pointcloudFile);

</script>

{#await pointclouds}
  <p>Fetching point clouds...</p>
{:then pointclouds}
  <select class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" bind:value={pointcloudFile}>
    {#each pointclouds as pointcloud}
      <option value={pointcloud}>{pointcloud}</option>
    {/each}
  </select>
{:catch error}
  <p>Failed to fetch point clouds: {error.message}</p>
{/await}
{#await points}
<p>Fetching point cloud...</p>
{:then pointsLoaded}
  <h1>{pointcloudFile} Pointcloud with {pointsLoaded.length} points</h1>
  <!-- a button that downloads the point cloud from /api/pointcloud/{pointcloudFile} -->
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="window.location.href='/api/pointcloud/{pointcloudFile}'">Download as ply</button>
  <ScatterPlot points={pointsLoaded} />
{:catch error}
  <p>Failed to fetch point cloud: {error.message}</p>
{/await}
