# MAPPING DIRECTIONS - WEB APP

This application lets you enter two locations and view step by step directions from the origin to the destination. It will return an elevation chart between the locations as well. You can also view your history of direction queries on the **HISTORY** page by selecting the date on which the directions were requested.

[homepage](http://3.16.140.115/index.html)

## FILE STRUCTURE

```index.html```

- Landing page for the application which explains how to use the app.

```directions.html```

- The core webpage of the application. This is where users can enter two locations and view cards containing an image, description, and distance/time for each specific maneuver of their route.

```history.html```

- Page for viewing past directions that the user has requested based on the query date.

```style.css```

- Style sheet used by the three pages above.

```fetch.js```

- File containing javascript functions used to get directions from mapquest, save data to local storage, and interact with the PHP REST server.

```final.class.php```

- Function definitions of methods used by the REST server.

```final.php```

- Contains the logic for instantiating the REST server when a request is made.

```RestServer.php```

- The actual framework that outlines the REST server and defines how it handles requests.