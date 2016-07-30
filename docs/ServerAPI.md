## Events

##### GET /api/events
  * returns array of all events

##### GET /api/events/:id
  * given an event id, returns array with single event

##### GET /api/events/:id/guests
  * given an event id, returns array of user objects who are guests

##### POST /api/events
  * request body should be event object with properties
    * title (string)
    * description (string)
    * created_by (int): id in user table
    * location (string)
    * time (dateTime optional)
    * duration (int optional): seconds
    * max_guests (int optional)
    * privacy (bool)
    * group_visibility (int): id in group table
  * creates new event and returns that event object

##### PUT /api/events/:id
  * request body should be event object with properties above to update
  * given an event id, updates event and returns that event object

##### DELETE /api/events/:id
  * given an event id, deletes event if exists and returns that deleted event object


## Users

##### GET /api/users/:id
  * given a user id, returns array with single user

##### POST /api/users
  * request body should be user object with properties
    * name (string)
    * email (string)
    * image (string)
    * facebook_id (string)
  * creates new user and returns that user object

