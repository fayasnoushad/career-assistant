from typing import List
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

URL = "https://www.edx.org/search?q={}&tab=course"


def get_course_details(card: WebElement):
    title = card.find_element(By.CLASS_NAME, "text-ellipsis").text
    channel = card.find_element(By.CLASS_NAME, "truncate").text.strip()
    channel_link = "https://www.edx.org/school/" + channel.lower()
    try:
        sm_text_elements = card.find_elements(By.CLASS_NAME, "text-sm")
        try:
            duration = sm_text_elements[1].find_element(By.TAG_NAME, "span").text
        except Exception:
            duration = None
        try:
            level = sm_text_elements[2].find_element(By.TAG_NAME, "span").text
        except Exception:
            level = None
    except Exception:
        duration = level = None
    link = card.find_element(By.TAG_NAME, "a").get_attribute("href")
    course_data = dict(
        title=title,
        channel=channel,
        channel_link=channel_link,
        duration=duration,
        level=level,
        link=link,
    )
    return course_data


def parse(driver: WebDriver, name: str) -> List[dict]:
    courses = []
    course_links = set()
    url = URL.format(name)
    driver.get(url)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "text-ellipsis"))
    )
    cards_el = driver.find_element(By.CLASS_NAME, "grid-cols-1")
    cards = cards_el.find_elements(By.CSS_SELECTOR, ":scope > div")
    for card in cards:
        WebDriverWait(card, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "a"))
        )
        # condition to avoid duplicates
        if (
            card.find_element(By.TAG_NAME, "a").get_attribute("href")
            not in course_links
        ):
            course_details = get_course_details(card)
            courses.append(course_details)
            course_links.add(course_details.get("link"))
    return courses
