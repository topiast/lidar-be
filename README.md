# Lidar api
## Description
This api is used to get the lidar data from the lidar sensor. 

## Running locally
```{bash}
docker-compose up
```

## Running in production
```{bash}
docker-compose -f docker-compose.prod.yml up -d
```

## Migrating the database
```{bash}
docker-compose -f docker-compose.prod.yml --profile migrate up
```