import requests
from dotenv import load_dotenv
import os
import base64
import re
from process_image import process_image_and_extract_text

load_dotenv()

# TMS_URL = "https://tms32.nepsetms.com.np"
TMS_URL = "https://demotrading.nepalstock.com"
# API_ENDPOINT = "https://notifier-1-b7933411.deta.app"
API_ENDPOINT = "http://127.0.0.1:4200"
USERNAME = os.getenv("TMS_USERNAME")
PASSWORD = os.getenv("TMS_PASSWORD")
DETA_API_KEY = os.getenv("DETA_API_KEY")

password_bytes = PASSWORD.encode('utf-8')
password_base64_encoded = base64.b64encode(password_bytes)
password_base64_encoded_string = password_base64_encoded.decode('utf-8')

try:
    get_captcha_id = requests.get(
        f"{TMS_URL}/tmsapi/authApi/captcha/id",
        headers={
            "Referer": f"{TMS_URL}/login",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
            "Host": TMS_URL.split("//")[-1],
        })
    captcha_id = get_captcha_id.json()["id"]

    get_captcha_image = requests.get(
        f"{TMS_URL}/tmsapi/authApi/captcha/image/{captcha_id}",
        stream=True,
        headers={
            "Referer": f"{TMS_URL}/login",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
            "Host": TMS_URL.split("//")[-1],
        })

    get_captcha_image.raise_for_status()
    image_path = 'captcha_image.jpg'
    with open(image_path, 'wb') as file:
        for chunk in get_captcha_image.iter_content(chunk_size=8192):
            file.write(chunk)

except Exception as e:
    print("oopse, there was an error fetching the captcha image")
    print(e)
    exit()

captcha_value = process_image_and_extract_text(image_path)
print(captcha_value)

# os.system(f'open {image_path}')
# captcha_value = input("Please enter the captcha value displayed on the page: ")

authenticate_user_response = requests.post(
    f"{TMS_URL}/tmsapi/authApi/authenticate",
    json={
        "userName": USERNAME,
        "password": password_base64_encoded_string,
        "captchaIdentifier": captcha_id,
        "userCaptcha": captcha_value
    },
    headers={
        "Content-Type": "application/json",
        "Origin": TMS_URL,
        "Referer": f"{TMS_URL}/login",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Host": TMS_URL.split("//")[-1],
    })

client_id = authenticate_user_response.json()["data"]["clientDealerMember"]["client"]["id"]
user_id = authenticate_user_response.json()["data"]["user"]["id"]
user_name = authenticate_user_response.json()["data"]["user"]["userName"]

if (authenticate_user_response.status_code == 200):
    print("User authenticated successfully")
else:
    print("oopse, there was an error authenticating the user")
    print(authenticate_user_response.status_code)
    exit()

cookies = authenticate_user_response.headers["Set-Cookie"].split(', ')
rid = re.search('_rid=([^;]*)', cookies[0]).group(1)
aid = re.search('_aid=([^;]*)', cookies[1]).group(1)
xsrf_token = re.search('XSRF-TOKEN=([^;]*)', cookies[2]).group(1)

print("Fetched authentication cookies successfully")

headers = {
    "Content-Type": "application/json",
    "X-Space-App-Key": DETA_API_KEY
}
data = {
    "_rid": rid,
    "_aid": aid,
    "xsrfToken": xsrf_token,
    "clientId": f"{client_id}",
    "userId": f"{user_id}",
    "userName": f"{user_name}",
}

print("Writing cookies to deta")
response = requests.patch(f"{API_ENDPOINT}/api/tms-auth/", headers=headers, json=data)
if (response.status_code == 200):
    print("Writing cookies to deta complete")
else:
    print("oopse, there was an error writing cookies")
    print(response.json())
