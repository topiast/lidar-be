<script>
    import { onMount } from 'svelte';
    import { scaleLinear } from 'd3-scale';

    export let points;

    let svg;
    let width = 500;
    let height = 500;
    const padding = { top: 40, right: 40, bottom: 40, left: 40 };

    let dataScale = {maxX: 0, minX: 0, maxY: 0, minY: 0};

    $ : dataScale = findMaxMin(points);

    $: xScale = scaleLinear()
        .domain([ dataScale.minX, dataScale.maxX])
        .range([padding.left, width - padding.right]);

    $: yScale = scaleLinear()
        .domain([dataScale.minY, dataScale.maxY])
        .range([height - padding.bottom, padding.top]);


    onMount(resize);

    function findMaxMin(data){
        if (data.length === 0) {
            return {maxX: 0, minX: 0, maxY: 0, minY: 0};
        }
        let maxX = data[0].x;
        let minX = data[0].x;
        let maxY = data[0].y;
        let minY = data[0].y;
        for (let i = 0; i < data.length; i++) {
            if (data[i].x > maxX) {
                maxX = data[i].x;
            }
            if (data[i].x < minX) {
                minX = data[i].x;
            }
            if (data[i].y > maxY) {
                maxY = data[i].y;
            }
            if (data[i].y < minY) {
                minY = data[i].y;
            }
        }
        return {maxX, minX, maxY, minY};
    }

    function resize() {
        width = svg.clientWidth;
        height = svg.clientHeight;
    }

</script>

<svelte:window on:resize={resize} />

<svg bind:this={svg} width={width} height={height}>

    <!-- data -->
    {#each points as point}
        <circle cx={xScale(point.x)} cy={yScale(point.y)} r="3" />
    {/each}
</svg>

<style>
    svg {
        width: 100%;
        height: 100%;
        float: left;
    }

    circle {
        fill: orange;
        fill-opacity: 0.6;
        stroke: rgba(0, 0, 0, 0.5);
    }

    .tick line {
        stroke: #ddd;
        stroke-dasharray: 2;
    }

    text {
        font-size: 12px;
        fill: #999;
    }

    .x-axis text {
        text-anchor: middle;
    }

    .y-axis text {
        text-anchor: end;
    }
</style>
