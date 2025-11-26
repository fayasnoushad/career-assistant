from typing import List
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

URL = "https://www.youtube.com/results?search_query={}&sp=EgIQAw%253D%253D"


def get_course_details(playlist: WebElement) -> dict[str, str | None]:
    title = playlist.find_element(
        By.CLASS_NAME, "yt-lockup-metadata-view-model__heading-reset"
    ).get_attribute("title")
    playlist_link = playlist.find_element(
        By.CLASS_NAME, "yt-lockup-metadata-view-model__title"
    ).get_attribute("href")
    meta_elements = playlist.find_elements(
        By.CLASS_NAME, "yt-content-metadata-view-model"
    )
    channel = meta_elements[0].find_element(By.TAG_NAME, "a")
    channel_name = channel.text
    channel_link = channel.get_attribute("href")
    course_data = dict(
        title=title,
        channel=channel_name,
        channel_link=channel_link,
        link=playlist_link,
    )
    return course_data


def parse(driver: webdriver.Firefox, name: str) -> List[dict]:
    courses = []
    url = URL.format(name)
    driver.get(url)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "yt-lockup-metadata-view-model"))
    )
    playlists = driver.find_elements(By.TAG_NAME, "yt-lockup-metadata-view-model")
    for playlist in playlists:
        courses.append(get_course_details(playlist))
    return courses
