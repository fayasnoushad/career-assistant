# webdriver.py
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.webdriver import WebDriver
from ...configs import DEV_MODE


def running_in_container() -> bool:
    return os.path.exists("/.dockerenv") or os.path.exists("/run/.containerenv")


def get_web_driver():
    options = Options()

    # Always headless in containers
    if running_in_container():
        options.binary_location = "/usr/bin/chromium"
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

    if not DEV_MODE:
        options.add_argument("--headless=new")

    return WebDriver(options=options)
