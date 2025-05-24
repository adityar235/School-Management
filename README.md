Deployment link of the project is URL: https://school-management-ou2r.onrender.com

This can be used for two purpose 
1.For POST request to sent and save the detail of new school (name, address, latitude, longitude)
2.For GET request it will receive a list of sorted colleges with its current latitude and longitude.

URL can be tested on postman:

POST URL: 
https://school-management-ou2r.onrender.com/api/addSchool
{
  "name": "Delhi public",
  "address": "school road",
  "latitude": 25.79,
  "longitude": 85.27
}

GET URL:
https://school-management-ou2r.onrender.com/api/listSchools?latitude=40.71&longitude=-70.33