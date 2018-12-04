'''
    Title: OCR prototype for the final year project 
    Student name: Mohamad Zabad
    Student number: C15745405
    Project name: Fleet Management System for Transportation Companies with OCR and ML

    github link: https://github.com/thezoomlesss/final_year_prototype

    The author highly recommends using the latest prototype found in the github repository
    mainly because the prototype runs on the same server as the final project, therefore, 
    in the development phase, certain configurations, ports and behaviour can change.

    This issue has been raised with Jonathan Mccarthy, the author's mentor, and he approved
    a continued development of the prototype until the time of presentation (6th of December 2018)

    Explanation of the cound can be found in the README file
'''
import numpy as np
import cv2
import  imutils
import easygui
from PIL import Image
from pytesseract import image_to_string

import urllib2
import requests



def extract_roi(image):
    
    # Scaling down the iamge to have a width of only 500 pixels for diplaying purposes
    image = imutils.resize(image, width=500)
    imagecopy= image.copy()
    
    # Display the original image
    cv2.imshow("Original Image", image)

    # RGB to Gray scale conversion
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    cv2.imshow("1 - Grayscale Conversion", gray_img)

    # Removing the noise by using a bilateral filter
    gray_img = cv2.bilateralFilter(gray_img, 11, 17, 17)
    cv2.imshow("2 - Bilateral Filter", gray_img)

    # Applying Canny to detect the weak and strong edges
    edges = cv2.Canny(gray_img, 170, 200)
    cv2.imshow("3 - Canny Edges", edges)

    # Find contours based on the edges returned by Canny
    (new, contours_all, _) = cv2.findContours(edges.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    #Sorting all contour areas and ignoring those which have a smaller width than 30 pixels
    contours_all=sorted(contours_all, key = cv2.contourArea, reverse = True)[:30] 
    #Creating an empty variable that will hold the contour at the end
    NumberPlateCnt = None

    # loop over our contours to find the best possible contour of number plate
    count = 0
    # Start with a default bounding box
    mx = (0,0,0,0)      
    mx_area = 0
    for c in contours_all:
            #finding the contour perimeter
            perimeter = cv2.arcLength(c, True)
            # Contour Approximation
            approx = cv2.approxPolyDP(c, 0.02 * perimeter, True)
            if len(approx) == 4:  # Only taking the contours that have 4 corners
                NumberPlateCnt = approx # Storing the new number plate in the variable created above
                break
    # getting the locations of the rectangle that covers the region of interest so we can crop the image out
    for cont in contours_all:
        x,y,w,h = cv2.boundingRect(cont)
        area = w*h
        if area > mx_area:
            maximum = x,y,w,h
            mx_area = area
    x,y,w,h = maximum
    # Drawing the selected contour on the original image
    cv2.drawContours(image, [NumberPlateCnt], -1, (0,255,0), 3)
    cv2.imshow("4 - Number plate detected", image)
    # Cropped image (region of interest)
    roi=imagecopy[y:y+h,x:x+w]
    cv2.imshow("5 - Number Plate isolated ", roi)   

    return roi

def roi_to_text(roi_in):
    # Taking in the region of interest and using pytesseract's function to get the text out of the number plate
    text_output=image_to_string(roi_in)
    return text_output

def post_to_server(text_output):
    
    # Displaying in an image the number plate to be posted
    text_img = np.zeros((400,500,3), np.uint8)
    fontUsed = cv2.FONT_HERSHEY_SIMPLEX
    center_img = (10,200)
    fontScale = 1
    fontColor = (255,255,255)
    lineType = 2

    cv2.putText(text_img,text_output, center_img, fontUsed, fontScale, fontColor, lineType)
    #Display the image
    cv2.imshow("Extracted text",text_img)


    # Uncomment this part if the server was configured properly

    # Url of the server where it expects a POST request containing the number plate and the date it arrrived
    url = 'http://159.69.217.98:3000'
    # r = requests.post(url, data={'"numberplate': text_output, 'date': ' 1:07 PM 12/04/2018'})
    # Answer from the server
    # print(r.status_code, r.reason)
    # print(text_output + " sent to the server")


def main():
    # Reading in the image using the easygui library
    filename = easygui.fileopenbox()
    image = cv2.imread(filename)
    roi_2 = extract_roi(image)
    text_output = roi_to_text(roi_2)
    post_to_server(text_output)

    cv2.waitKey(0)
if __name__== "__main__":
    main()
