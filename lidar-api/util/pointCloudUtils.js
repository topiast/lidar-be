
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
    // the file name is the date in the format dd-mm-yyyy-hh-mm-ss
    const date = new Date();
    const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    Deno.writeTextFileSync(`./pointClouds/pointCloud${dateString}.ply`, plyString);
    console.log('ply file written')
}
