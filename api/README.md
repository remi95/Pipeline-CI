# Concerto
## API Documentation
Every response returned by the API should have the following structure :
```
    {
      statusCode: int,
      results: array|string,
      error: string|null,
    }
```
### Routes availables
#### Authentication
* Register  ```/auth/register (POST)```
    * Params : 
         * email (string, required)   
         * password (string, required)   
         * lastname (string, required)   
         * firstname (string, required)   
         * birthdate (string, required, format: *2020-04-01 12:00:00*)
         * phone (string, required)
         * picture (file)
* Login ``` /auth/login (POST) ```
    * Params :
        * email (string, required)
        * password (string, required)

#### User
* Get user ``` /api/user (GET)```
* Edit user ``` /api/user (POST) ```
    * Params :
        * password (string)
        * phone (string)
        * picture (file)
* Get user favors ``` /api/user/favors (GET) ```
* Get user requests ``` /api/user/requests (GET) ```

#### Favor
* Get all favors filtered ``` /favor (GET) ```
    * Params :
        * department (int, required)
        * page (int)
        * cities (array[string])
        * title (string)
        * categories (array[string])
        * dateStart (string)
        * dateEnd (string)
* Get favor details ``` /favor/{id} (GET) ```
* Apply to favor ``` /api/favor/apply/{favorId} (GET) ```
* Accept application to favor ``` /api/favor/accept/{favorId}/{userId} (POST) ```
    * Params :
        * accepted (bool, required)
* Comment a favor ``` /api/favor/{id}/comment ```
    * Params : 
        * content (string, required)
* Get favor creation form ``` /api/favor/form (GET) ```
* Create favor ``` /api/favor (POST) ```
    * Fields :
        * title (string, required)
        * content (string, required)
        * dateStart (date, required)
        * dateEnd (date, required)
        * cities (array, required)
            *  name (string, required)
            *  department (integer, required)
            *  postalCode (string, required)
        * placeLimit (integer, required)
        * category (string, required)
        * pictures (array of files)

#### Request
* Get all requests filtered ``` /request (GET) ```
    * Params :
        * department (int, required)
        * page (int)
        * cities (array[string])
        * title (string)
        * dateStart (string)
        * dateEnd (string)
* Get request details ``` /api/request/{id} (GET) ```
* Get request creation form ``` /api/request/form (GET) ```
* Create favor ``` /api/request (POST) ```
    * Fields :
        * title (string, required)
        * content (string, required)
        * dateStart (date, required)
        * dateEnd (date, required)
        * cities (array, required)
            *  name (string, required)
            *  department (integer, required)
            *  postalCode (string, required)
        * pitcures (array of files)

#### Search
* Autocomplete ``` /api/autocomplete (POST) ```
    * Params :
        * text (string, required)                                             
                
    