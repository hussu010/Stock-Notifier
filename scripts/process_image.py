import cv2
import numpy as np
import pytesseract
import re

def process_image_and_extract_text(input_path):
    # Read the image
    image = cv2.imread(input_path, cv2.IMREAD_COLOR)

    height, width, _ = image.shape

    # Let's define the cropping boundaries
    left = 88
    right = width - 88
    top = 22
    bottom = height - 22

    # Crop the image to only get the captcha
    cropped_image = image[top:bottom, left:right]
    
    # Convert the image to grayscale
    grayscale_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

    # Threshold the image to make the background white and the text black
    _, thresholded_image = cv2.threshold(grayscale_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Define a kernel for the morphological operation. Adjust the size (5,5) as needed.
    kernel = np.ones((2,2), np.uint8)

    # Apply a morphological opening operation to remove small dots
    opened_image = cv2.morphologyEx(thresholded_image, cv2.MORPH_OPEN, kernel)

    # If you want to further invert the image to have black text on white background
    inverted_image = cv2.bitwise_not(opened_image)

    # Save the processed image
    cv2.imwrite("extracted_image.jpg", inverted_image)

    text = pytesseract.image_to_string(inverted_image)

    return ''.join([char.lower() for char in text if char.isalnum()])
