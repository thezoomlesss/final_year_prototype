# Final Year Project - Prototype
- Title: OCR prototype for the final year project 
- Student name: Mohamad Zabad
- Student number: C15745405
- Project name: Fleet Management System for Transportation Companies with OCR and ML


#### Disclaimer
>The author highly recommends using the latest prototype found in this github repository
>because the prototype runs on the same server as the final project, therefore, 
>in the development phase, certain configurations such as a security protocol, ports 
>and other behaviour can change.

This issue has been raised with Jonathan Mccarthy, the author's mentor, and he approved
a continued development of the prototype until the time of presentation (6th of December 2018)

[![Video Prototype](https://img.youtube.com/vi/fod-BSnIUUs&fbclid=IwAR2q89Kb4W4asvtwjHhUHl-_hPeDMknlNhB5NkwMF3I5IcD2R8wPAV8jYjI/0.jpg)](https://www.youtube.com/watch?v=fod-BSnIUUs&fbclid=IwAR2q89Kb4W4asvtwjHhUHl-_hPeDMknlNhB5NkwMF3I5IcD2R8wPAV8jYjI)

#### Prototype contents
* **OCR_Prototype.py** - This would simulate the code present on the minicomputer placed at the entrance of a warehouse
The code present will preprocess the sample image after the GUI appears (please use sample_image.jpg) after which 
it will extract the characters from the isolated region of interest and set a POST request to the server on a 
predefined port (at the moment, port 3000).

* **sample_img.jpg** - This is the image used when running the python OCR prototype

* **App1.js** - This is the main file of the node app made to control the database data writing and reading for the get and POST requests
Currently, it opens on port 1337 port of the server on the /adddb and /website paths and it connects to the AWS RDS instance through the details contained in a hidden json file. 

#### Explanation
* There is an AWS RDS instance running MySQL holding all the data for us

* The python script will accept an image from a vehicle and extract its number plate

* After extracting a nubmer plate, it will send it to the server with a predefined warehouse id (1) and a set date(3:00 PM 12/6/2018)
The date is hardcoded only for testing purposes

* The server will react to the POST request and will get the location of the warehouse (lat and long) by using the warehouse id
Then it will get the id of the number plate since it knows the number plate value
After that it will get the vehicle id since it knows the id of the number plate
Finally, it will get the id of the last location record of that vehicle
After gathering all the information, it will run a query which updates the last location's latitude, longitude and date

* The website, upon being opened(or refreshed) will retrieve the new data into the table

#### How to execute it

* First you should open the website at http://159.69.217.98:1337/website
If the page doesn't respond it means that the node app is currently not running (contact the author, details at the bottom)

* If the page responded, pay attention to the last 3 columns
You can run OCR_Prototype.py to test the POST method and OCR from the number plate
Please use the sample image, other number plates won't work since they are not registered in the database

* After running the python script, refresh the website and notice how the values have changed (unless the database already held the same values)


All the code present in these files is work of the author and only the author. 
For any queries please contact the author at: C15745405@mydit.ie or hamudazabad@gmail.com