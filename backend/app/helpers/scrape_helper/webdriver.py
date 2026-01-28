import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from ...configs import DEV_MODE


options = Options()


if not DEV_MODE:
    options.add_argument("--headless")

options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")


async def get_web_driver():
    return webdriver.Chrome(options=options)
