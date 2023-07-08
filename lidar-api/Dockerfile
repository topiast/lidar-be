FROM denoland/deno:alpine-1.31.0

EXPOSE 7777

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .

# compile the cpp library
# install g++ to compile the cpp library
RUN apk add --no-cache g++
RUN g++ -std=c++11 -fPIC -shared -o cpp/build/liblidar.so cpp/src/lidar.cpp

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-env", "--allow-write", "--allow-ffi", "app.js" ]