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

#### Prototype contents
* **OCR_Prototype.py** - This would simulate the code present on the minicomputer placed at the entrance of a warehouse
The code present will preprocess the sample image after the GUI appears (please use sample_image.jpg) after which 
it will extract the characters from the isolated region of interest and set a POST request to the server on a 
predefined port (at the moment, port 3000).

* **sample_img.jpg** - This is the image used when running the python OCR prototype

* **express1.js** - This is the file that sets the node app to listen to a certain port (subject to change a lot due to the reverse proxy)

* **express2.js** - This is the file that sets the website react + node app to listen to a certain port (subject to change a lot due to the reverse proxy)

* **App1.js** - This is the main file of the node app made to control the database data writing and the POST request
Currently, it opens on port 1337 of the server and it connects to the AWS RDS instance. 
You can run OCR_Prototype.py to test the POST method with parameters but the node app must be running on the server at the same time, which it currently doesn't do 24/7

* **App2.js** - This is the main file of the node app made to display a website created in React. It also handles all the
database queries that the website could use. In this context, it will display a list of vehicles available in a certain warehouse
 
All the code present in these files is work of the author and only the author. 
For any queries please contact the author at: C15745405@mydit.ie or hamudazabad@gmail.com