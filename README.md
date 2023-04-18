## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
Node version 18.9.0
### How to install the app on local:
```bash
$ npm i
$ set the NODE_ENV to development or production
    To set an environment variable in Windows:
    SET NODE_ENV=development
    on OS X or Linux:
    export NODE_ENV=development
```

### Configure app for development
Duplicate development.env.example and remove the '.exmaple' from the file name.
Make sure there is a mysql server running and all the configuration is correct (database host, username, etc).
Duplicate secrets/secrets.json.example and remove the '.exmaple' from the file name.

# REST API Documentation
## Endpoints
### GET /scrapper/crawl/:url
Crawls a website and returns its HTML content.

#### Parameters
url - The URL of the website to be crawled.
##### Response
Returns the HTML content of the website.

### GET /scrapper/get-data/:url
Extracts data from a website.

#### Parameters
url - The URL of the website to extract data from.
##### Response
Returns an object containing the extracted data from the website.

## API Version and Tags
This API is versioned as version: '1' and is tagged as Scrapper using the ApiTags decorator from @nestjs/swagger.
