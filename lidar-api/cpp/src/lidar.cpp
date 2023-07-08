#include <math.h>
#include <stdio.h>

struct Point3d
{
    float x;
    float y;
    float z;
};

extern "C" {
    void print();
    int add(int a, int b);
    Point3d convert_to_point(float angle1, float angle2, float distance);
}
// to compile: g++ -shared -fPIC lidar.cpp -o build/liblidar.so

// Convert angles and distance to 3d point
Point3d convert_to_point(float alpha, float betha, float distance) {
    Point3d point;
    // Convert angles to radians
    float alpha_rad = alpha * M_PI / 180.0;
    float betha_rad = betha * M_PI / 180.0;
    // Calculate x, y, z
    point.x = distance * cos(alpha_rad) * cos(betha_rad);
    point.y = distance * sin(alpha_rad) * cos(betha_rad);
    point.z = distance * sin(betha_rad);

    // //print the point
    // printf("Point: (%f, %f, %f)\n", point.x, point.y, point.z);
    return point;
}

int add(int a, int b) {
    return a + b;
}

void print() {
    printf("Hello from C++!\n");
}