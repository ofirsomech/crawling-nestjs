## NestJS Web Scraper Application
### Configure app for development
Duplicate production.env.example and remove the '.exmaple' from the file name.
Make sure there is a mysql server running and all the configuration is correct (database host, username, etc).

### Configure and start docker
```bash
$ docker compose up --build
```
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

Node version 18.9.0

### How to install the app on local:

```bash
$ npm i
```


# REST API Documentation

## Endpoints

### Crawling Websites

To crawl a website, send a POST request to /scrapper/crawl with a JSON payload containing the URL of the website you
want to crawl:

```bash
{
  "url": "https://www.example.com"
}
```

#### Parameters

url - The URL of the website to be crawled.

##### Response

The response will contain the following information:

- screenshot: A base64-encoded screenshot of the website.
- links: The number of links found on the website.
- stylesheets: The number of stylesheets found on the website.
- scripts: The number of scripts found on the website.
- duration: The time it took to crawl the website in seconds.

### Retrieving Scanned Data

To retrieve all scanned data, send a GET request to /scrapper/get-scans. The response will contain an object with the
following properties:

#### Parameters

url - The URL of the website to extract data from.

##### Response

- screenshots: An array of objects containing information about each screenshot.
- links: An array of objects containing information about each link.
- stylesheets: An array of objects containing information about each stylesheet.
- scripts: An array of objects containing information about each script.

## API Version and Tags

This API is versioned as version: '1' and is tagged as Scrapper using the ApiTags decorator from @nestjs/swagger.
