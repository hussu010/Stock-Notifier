from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
from dotenv import load_dotenv
import os

load_dotenv()

driver = webdriver.Firefox()

TMS_URL = "https://tms32.nepsetms.com.np/login"
USERNAME = os.getenv("TMS_USERNAME")
PASSWORD = os.getenv("TMS_PASSWORD")
DETA_API_KEY = os.getenv("DETA_API_KEY")

driver.set_window_size(300, 800)
driver.get(TMS_URL)

username_field = driver.find_element(By.XPATH, '//input[@placeholder="Client Code/ User Name"]')
password_field = driver.find_element(By.ID, "password-field")
captcha_input = driver.find_element(By.ID, "captchaEnter")
login_button = driver.find_element(By.XPATH, '//input[@type="submit" and @value="Login"]')

username_field.send_keys(USERNAME)
password_field.send_keys(PASSWORD)

captcha_value = input("Please enter the captcha value displayed on the page: ")
captcha_input.send_keys(captcha_value)

login_button.click()

all_cookies = driver.get_cookies()

_rid = all_cookies[0]["value"]
_aid = all_cookies[1]["value"]
xsrfToken = all_cookies[2]["value"]

headers = {
    "Content-Type": "application/json",
    "X-Space-App-Key": DETA_API_KEY
}
data = {
    "_rid": _rid,
    "_aid": _aid,
    "xsrfToken": xsrfToken,
}

response = requests.patch("https://notifier-1-b7933411.deta.app/api/tms-auth/", headers=headers, json=data)
if (response.status_code == 200):
    print("Writing cookies to deta complete")
else:
    print("oopse, there was an error writing cookies")
    print(response.json())

print("Closing the browser in 5 seconds")
import time
time.sleep(5)
print("Closing the browser now")

driver.quit()
