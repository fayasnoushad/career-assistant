from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from ...configs import DEV_MODE


options = Options()
if not DEV_MODE:
    options.add_argument("--headless")


async def get_web_driver():
    return webdriver.Firefox(options=options)
