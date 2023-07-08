
// a function that exports the point cloud to a ply file
export const exportToPly = (pointCloud) => {
    const plyHeader = `ply
    format ascii 1.0
    element vertex ${pointCloud.length}
    property float x
    property float y
    property float z
    end_header
    `;
    let plyString = plyHeader;
    pointCloud.forEach((point) => {
        plyString += `${point.x} ${point.y} ${point.z}\n`;
    });
    
    // write the ply file to a folder pointClouds
    Deno.writeTextFileSync(`./pointClouds/pointCloud${Date.now()}.ply`, plyString);
    console.log('ply file written')
}
