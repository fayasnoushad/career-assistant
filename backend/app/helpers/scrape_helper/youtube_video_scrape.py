from .webdriver import get_web_driver
from fastapi.concurrency import run_in_threadpool
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

URL = "https://www.youtube.com/results?search_query={}&sp=EgIQAQ%253D%253D"


def get_video_link(video: WebElement) -> str | None:
    video_link = video.find_element(By.TAG_NAME, "a").get_attribute("href")
    return video_link


async def scrape_youtube_videos(name: str) -> list[str]:
    videos = []
    url = URL.format(name)
    driver = await run_in_threadpool(get_web_driver)
    driver.get(url)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "ytd-video-renderer"))
    )
    video_elements = driver.find_elements(By.TAG_NAME, "ytd-video-renderer")
    for video in video_elements[:4]:
        video_link = get_video_link(video)
        if video_link:
            video_link = video_link.split("&")[0]
            video_link = video_link.replace("watch?v=", "embed/")
            video_link += "?si=wg84FePJT0nA7Ex9"
            videos.append(video_link)
    driver.quit()
    return videos
