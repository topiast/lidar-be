export { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import postgres from "https://deno.land/x/postgresjs@v3.3.3/mod.js";
export { postgres };

// load the cpp library


const libName = "./cpp/build/liblidar.so";
// Open library and define exported symbols
const lib = Deno.dlopen(libName, {
    "convert_to_point": { parameters: ["f32", "f32", "f32"], result: { struct: ["f32", "f32", "f32"] } },
    "add": { parameters: ["isize", "isize"], result: "isize" },
    "print": { parameters: [], result: "void" },
}); 

// Define the exported function
export const convert = (x, y) => {
    lib.print();
    return 0;
    // return lib.add(Int(x), Int(y));
}
export const cppPrint = () => {
    lib.symbols.print();
}
export const add = (x, y) => {
    return lib.symbols.add(parseInt(x), parseInt(y));
}
export const convertToPoint = (angle1, angle2, z) => {    
    const result = lib.symbols.convert_to_point(angle1, angle2, z);
    return convertUint8ArrayToPoint(result);
}

// a fuction that converts Uint8Array of size 12 to a point
function convertUint8ArrayToPoint(uint8Array) {
    if (uint8Array.length !== 12) {
      throw new Error('Uint8Array size must be 12');
    }
    const floatArray = [];
  
    for (let i = 0; i < 12; i += 4) {
      const uint8Slice = uint8Array.slice(i, i + 4);
      const dataView = new DataView(uint8Slice.buffer);
      const floatValue = dataView.getFloat32(0, true);
      floatArray.push(floatValue);
    }
  
    return { x: floatArray[0], y: floatArray[1], z: floatArray[2]};
  }