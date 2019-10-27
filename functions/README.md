# Slash

----------------

API for slash.ge

----------------

## Request Quote

```
POST https://us-central1-slash-c692a.cloudfunctions.net/api/
requestQuote
```

Request a price quote for a webiste. Sends email to info@slash.ge.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |email|example@example.org|text|min: 1 , max: 50|
> |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> |lang|en|text|Language, defaults to 'ge'. Other option is 'en'|
> |companyName|Just a sample company|text|min: 1 , max: 100|
> |siteType|Just a normal website|text|min: 1 , max: 100|
> 

### Examples:

> 
> **Example: Request Quote Missing Error **
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > requestQuote
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |email|example@example.org|text|min: 1 , max: 50|
> > > |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> > > |lang|en|text|Language, defaults to 'ge'. Other option is 'en'|
> > > |companyName|Just a sample company|text|min: 1 , max: 100|
> > > |siteType|Just a normal website|text|min: 1 , max: 100|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "error", 
> > >   "errors": [
> > >     "Please enter email"
> > >   ]
> > > }
> > > ```
> > > 
> > 
> 
> **Example: Request Quote Success**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > requestQuote
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |email|example@example.org|text|min: 1 , max: 50|
> > > |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> > > |lang|ge|text|Language, defaults to 'ge'. Other option is 'en'|
> > > |companyName|Just a sample company|text|min: 1 , max: 100|
> > > |siteType|Just a normal website|text|min: 1 , max: 100|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "success", 
> > >   "message": "\u10db\u10d4\u10d8\u10da\u10d8 \u10d2\u10d0\u10d2\u10d6\u10d0\u10d5\u10dc\u10d8\u10da\u10d8\u10d0! \u10e9\u10d5\u10d4\u10dc\u10d8 \u10d2\u10e3\u10dc\u10d3\u10d8 \u10db\u10d0\u10da\u10d4 \u10d3\u10d0\u10d2\u10d4\u10d9\u10dd\u10dc\u10e2\u10d0\u10e5\u10e2\u10d4\u10d1\u10d0\u10d7."
> > > }
> > > ```
> > > 
> > 
> 

----------------

## Contact

```
POST https://us-central1-slash-c692a.cloudfunctions.net/api/
contact
```

Contact form route. Sends email to info@slash.ge.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |email|example@example.org|text|min: 1 , max: 50|
> |subject|Test subject line|text|min: 1 , max: 100|
> |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> |lang|ge|text|Language, defaults to 'ge'. Other option is 'en'|
> 

### Examples:

> 
> **Example: Contact Success**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > contact
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |email|example@example.org|text|min: 1 , max: 50|
> > > |subject|Test subject line|text|min: 1 , max: 100|
> > > |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> > > |lang|ge|text|Language, defaults to 'ge'. Other option is 'en'|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "success", 
> > >   "message": "\u10db\u10d4\u10d8\u10da\u10d8 \u10d2\u10d0\u10d2\u10d6\u10d0\u10d5\u10dc\u10d8\u10da\u10d8\u10d0! \u10e9\u10d5\u10d4\u10dc\u10d8 \u10d2\u10e3\u10dc\u10d3\u10d8 \u10db\u10d0\u10da\u10d4 \u10d3\u10d0\u10d2\u10d4\u10d9\u10dd\u10dc\u10e2\u10d0\u10e5\u10e2\u10d4\u10d1\u10d0\u10d7."
> > > }
> > > ```
> > > 
> > 
> 
> **Example: Contact Missing Error**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > contact
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |email|example@example.org|text|min: 1 , max: 50|
> > > |subject|Test subject line|text|min: 1 , max: 100|
> > > |text|just some sample text to test out the api.|text|min: 1 , max: 1000|
> > > |lang|ge|text|Language, defaults to 'ge'. Other option is 'en'|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "error", 
> > >   "errors": [
> > >     "\u10d2\u10d7\u10ee\u10dd\u10d5\u10d7 \u10e8\u10d4\u10d8\u10e7\u10d5\u10d0\u10dc\u10dd\u10d7 \u10db\u10d4\u10d8\u10da\u10d8", 
> > >     "\u10d2\u10d7\u10ee\u10dd\u10d5\u10d7 \u10e8\u10d4\u10d8\u10e7\u10d5\u10d0\u10dc\u10dd\u10d7 \u10e1\u10d0\u10d7\u10d0\u10e3\u10e0\u10d8"
> > >   ]
> > > }
> > > ```
> > > 
> > 
> 

----------------

## Create Portfolio Item

```
POST https://us-central1-slash-c692a.cloudfunctions.net/api/
createPortfolioItem
```

Add a portfolio entry.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |name|Name|text|min: 1 , max: 50|
> |shortDescription|short|text|min: 10 , max: 200|
> |longDescription|Test long description. This description has to be long|text|min: 10 , max: 200000|
> |logoImage|https://via.placeholder.com/500|text|Link to logo image|
> |thumbnailImage|https://via.placeholder.com/500|text|Link to thumbnail image|
> |images[]|https://via.placeholder.com/500|text|Array of links to images|
> |stackImages[0][name]|name|text|Optional array of stack images with a name, imageLink, and link properties | Name of stack item|
> |stackImages[0][imageLink]|https://via.placeholder.com/500|text|Optional array of stack images with a name, imageLink, and link properties | Link to image|
> |stackImages[0][link]|example.com|text|Optional array of stack images with a name, imageLink, and link properties | Link to github repo|
> |lang|wrong|text|Language, defaults to 'ge'. Other option is 'en'|
> |adminPass|test|text|Administrator Password|
> 

### Examples:

> 
> **Example: Create Portfolio Item Success**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > createPortfolioItem
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |name|Test name|text|min: 1 , max: 50|
> > > |shortDescription|Test short descriptio|text|min: 10 , max: 200|
> > > |longDescription|Test long description. This description has to be long|text|min: 10 , max: 200000|
> > > |logoImage|https://via.placeholder.com/500|text|Link to logo image|
> > > |thumbnailImage|https://via.placeholder.com/500|text|Link to thumbnail image|
> > > |images[]|https://via.placeholder.com/500|text|Array of links to images|
> > > |stackImages[0][name]|name|text|Array of stack images with a name, imageLink, and link properties | Name of stack item|
> > > |stackImages[0][imageLink]|https://via.placeholder.com/500|text|Array of stack images with a name, imageLink, and link properties | Link to image|
> > > |stackImages[0][link]|example.com|text|Array of stack images with a name, imageLink, and link properties | Link to github repo|
> > > |lang|en|text|Language, defaults to 'ge'. Other option is 'en'|
> > > |adminPass|test_password|text|Administrator password|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "success", 
> > >   "message": "Files uploaded."
> > > }
> > > ```
> > > 
> > 
> 
> **Example: Create Portfolio Item Too Short Error**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > createPortfolioItem
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |name|Name|text|min: 1 , max: 50|
> > > |shortDescription|short|text|min: 10 , max: 200|
> > > |longDescription|Test long description. This description has to be long|text|min: 10 , max: 200000|
> > > |logoImage|https://via.placeholder.com/500|text|Link to logo image|
> > > |thumbnailImage|https://via.placeholder.com/500|text|Link to thumbnail image|
> > > |images[]|https://via.placeholder.com/500|text|Array of links to images|
> > > |stackImages[0][name]|name|text|Optional array of stack images with a name, imageLink, and link properties | Name of stack item|
> > > |stackImages[0][imageLink]|https://via.placeholder.com/500|text|Optional array of stack images with a name, imageLink, and link properties | Link to image|
> > > |stackImages[0][link]|example.com|text|Optional array of stack images with a name, imageLink, and link properties | Link to github repo|
> > > |lang|wrong|text|Language, defaults to 'ge'. Other option is 'en'|
> > > |adminPass|test_password|text|Administrator password|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "error", 
> > >   "errors": [
> > >     "\u10db\u10dd\u10d9\u10da\u10d4 \u10d0\u10e6\u10ec\u10d4\u10e0\u10d0 \u10e3\u10dc\u10d3\u10d0 \u10d8\u10e7\u10dd\u10e1 \u10db\u10d0\u10e5\u10e1\u10d8\u10db\u10e3\u10db 10 \u10e1\u10d8\u10db\u10d1\u10dd\u10da\u10dd."
> > >   ]
> > > }
> > > ```
> > > 
> > 
> 
> **Example: Create Portfolio Item Missing Items Error**
> 
> > 
> > ```
> > POST https://us-central1-slash-c692a.cloudfunctions.net/api/
> > createPortfolioItem
> > ```
> > 
> > **Request**
> > 
> > > 
> > > **Header**
> > > 
> > > |Key|Value|Description|
> > > |---|---|---|
> > > |Content-Type|application/x-www-form-urlencoded||
> > > 
> > > **Body**
> > > 
> > > |Key|Value|Type|Description|
> > > |---|---|---|---|
> > > |name|Test name|text|min: 1 , max: 50|
> > > |shortDescription|Test short descriptio|text|min: 10 , max: 200|
> > > |longDescription|Test long description. This description has to be long|text|min: 10 , max: 200000|
> > > |logoImage|https://via.placeholder.com/500|text|Link to logo image|
> > > |thumbnailImage|https://via.placeholder.com/500|text|Link to thumbnail image|
> > > |images[]|https://via.placeholder.com/500|text|Array of links to images|
> > > |stackImages[0][name]|name|text|Optional array of stack images with a name, imageLink, and link properties | Name of stack item|
> > > |stackImages[0][imageLink]|https://via.placeholder.com/500|text|Optional array of stack images with a name, imageLink, and link properties | Link to image|
> > > |stackImages[0][link]|example.com|text|Optional array of stack images with a name, imageLink, and link properties | Link to github repo|
> > > |lang|en|text|Language, defaults to 'ge'. Other option is 'en'|
> > > |adminPass|test_password|text|Administrator password|
> > > 
> > 
> > ----------------
> > 
> > **Response**
> > 
> > > 
> > > **Body**
> > > 
> > > ```
> > > {
> > >   "status": "error", 
> > >   "errors": [
> > >     "Please enter short description", 
> > >     "Please enter images"
> > >   ]
> > > }
> > > ```
> > > 
> > 
> 

----------------

----------------

Built with [Postdown][PyPI].

Author: [Titor](https://github.com/TitorX)

[PyPI]:    https://pypi.python.org/pypi/Postdown
