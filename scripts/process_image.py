import cv2
import numpy as np
import pytesseract

def process_image(input_path, output_path):
    # Read the image
    image = cv2.imread(input_path, cv2.IMREAD_COLOR)
    
    # Convert the image to grayscale
    grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Threshold the image to make the background white and the text black
    _, thresholded_image = cv2.threshold(grayscale_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Define a kernel for the morphological operation. Adjust the size (5,5) as needed.
    kernel = np.ones((2,2), np.uint8)

    # Apply a morphological opening operation to remove small dots
    opened_image = cv2.morphologyEx(thresholded_image, cv2.MORPH_OPEN, kernel)

    # If you want to further invert the image to have black text on white background
    inverted_image = cv2.bitwise_not(opened_image)

    # Save the processed image
    cv2.imwrite(output_path, inverted_image)
    
    return inverted_image

# Use the function
processed_img = process_image("captcha_image1.jpg", "path_to_save_processed_image.jpg")

# Extract text using pytesseract
text = pytesseract.image_to_string(processed_img)
print(text)
