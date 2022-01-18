# API Endpoints

**Work in progress. Please update as changes are made to the contract.**

## Table of Contents <!-- omit in toc -->

- [Base Path](#base-path)
- [Authorization header](#authorization-header)
- [/components POST](#components-post)
- [/design/id GET](#designid-get)
- [/design/id PUT](#designid-put)
- [/programs GET](#programs-get)

Documentation of the contract implemented by the API.

## Base Path

The format of API calls is: `<host>/<version>/<resource>`.

Example: `https://dpb-api.evan.instantencore.com/1/programs`

Host: `https://dpb-api.evan.instantencore.com`
Version: `1`
Resource: `programs`

## Authorization header

Requests should include the `Authorization` header with a `Bearer` token. The value of the token is a stringified json object with the `cid` that identifies the client who the requests are being made for.

The requests that require this are:

- `/components POST`
- `/programs GET`

### Future

The token should be the jwt token that encodes the json object. The API will decode this to get the `cid`.

## /components POST

Associates a component with a page.

Functionality depends on the value of `createOrAdd`:
`create`: Create new component and associate it with a page.
`add`: Adds an existing component to a page.

### Request

#### Body: create

```json
{
  "pageOrProgramId": 44,
  "internalName": "test hardcoded",
  "type": "thumbnail",
  "visible": true,
  "createOrAdd": "create"
}
```

#### Body: add

```json
{
  "pageOrProgramId": 44,
  "componentId": 12,
  "visible": true,
  "createOrAdd": "add"
}
```

### Response

```json
{
  "id": 1
}
```

## /design/id GET

Returns the design variables and custom css for a client.

### Request

| Field | Type | Data Type | Required | Description |
| ----- | ---- | --------- | -------- | ----------- |
| id    | path | int       | yes      | clientId    |

### Response

```json
{
  "id": 1,
  "customCss": {
    "id": 0,
    "customCss": ""
  },
  "clientVariables": [
    {
      "designVariableId": 1,
      "value": ""
    }
  ],
  "designVariables": [
    {
      "id": 0,
      "orderIndex": 0,
      "name": "Page background color",
      "description": "Main background color.",
      "defaultValue": "#fff",
      "type": "color"
    },
    {
      "id": 1,
      "orderIndex": 1,
      "name": "Page text color",
      "description": "Text color on top of the background.",
      "defaultValue": "#333",
      "type": "color"
    }
  ]
}
```

## /design/id PUT

Sets the design variables and custom css for a client.

### Request

| Field | Type | Data Type | Required | Description |
| ----- | ---- | --------- | -------- | ----------- |
| id    | path | int       | yes      | clientId    |

#### Body

```json
{
  "customCss": {
    "id": 0,
    "customCss": ""
  },
  "clientVariables": [
    {
      "designVariableId": 1,
      "value": ""
    }
  ]
}
```

### Response

Same response as GET /design/id.

## /programs GET

Returns a list of programs. Results are filtered to only display programs that belong to the user that is longed in. The `Authorization` header includes a Bearer token that identifies the user. See [cms/README.md](../../cms/README.md#authentication-and-the-api).

### Request

- No params

### Response

```json
{
  "id": 3,
  "internalName": "Vertical List",
  "type": "verticalList",
  "dates": [
    {
      "id": 0,
      "localStartDate": "",
      "localEndDate": "",
      "utcEndDate": "",
      "utcStartDate": "",
      "timeZone": ""
    }
  ],
  "visible": true,
  "maxCards": 1,
  "cardImageSize": "cover",
  "cardImagePosition": "left",
  "status": "ok",
  "libraryComponent": false,
  "viewAllText": "view all",
  "style": "default",
  "ad": false,
  "cards": [
    {
      "id": 0,
      "componentId": 3,
      "action": "page",
      "pageId": 1,
      "pageDescription": "You can edit the Page",
      "title": "Jane Doe",
      "visible": true,
      "description": "Actress",
      "orderIndex": 0,
      "imageUrl": "https://image.shutterstock.com/z/stock-photo-microphone-over-the-abstract-blurred-photo-of-conference-hall-or-seminar-room-with-attendee-1196667214.jpg"
    },
    {
      "id": 1,
      "componentId": 3,
      "action": "link",
      "url": "http://johnsmith.com",
      "title": "John Smith",
      "visible": true,
      "description": "Writer",
      "orderIndex": 1,
      "imageUrl": "https://image.shutterstock.com/z/stock-photo-microphone-over-the-abstract-blurred-photo-of-conference-hall-or-seminar-room-with-attendee-1196667214.jpg"
    }
  ]
}
```
