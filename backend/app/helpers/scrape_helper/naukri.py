from datetime import datetime, timezone
from ... import schemas
from typing import List
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ...configs import MIN_JOB_LIMIT as LIMIT


URL = "https://www.naukri.com/{}"


def get_job_details(driver: webdriver.Firefox, link: str) -> tuple[str, str]:
    driver.get(link)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "job_header"))
    )
    try:
        location = driver.find_element(
            By.CLASS_NAME, "styles_jhc__location__W_pVs"
        ).text
    except:
        location = None
    description = []
    desc_classes = [
        "styles_JDC__dang-inner-html__h0K4t",
        "styles_other-details__oEN4O",
        "styles_education__KXFkO",
    ]
    desc_element = driver.find_element(
        By.CLASS_NAME, "styles_job-desc-container__txpYf"
    )
    for desc_class in desc_classes:
        element = desc_element.find_element(By.CLASS_NAME, desc_class)
        description.append(element.text)
    return (location or "", "\n\n".join(description).strip())


def parse(job_name: str, driver: webdriver.Firefox) -> List[dict]:
    url = URL.format(job_name.replace(" ", "-") + "-jobs")
    driver.get(url)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "srp-jobtuple-wrapper"))
    )
    jobs: List[dict] = []
    count = 0
    page_no = 1
    while True:
        try:
            job_list = driver.find_elements(By.CLASS_NAME, "srp-jobtuple-wrapper")
            for job in job_list:
                name = job.find_element(By.CLASS_NAME, "title").text
                link = job.find_element(By.CLASS_NAME, "title").get_attribute("href")
                try:
                    company = job.find_element(By.CLASS_NAME, "comp-name").text
                except:
                    company = ""
                job_data = {
                    "name": name,
                    "company": company,
                    "salary": None,  # salary of naukri is unstructured
                    "link": link,
                    "time": str(datetime.now(timezone.utc)),
                }
                jobs.append(job_data)
                count += 1
                if count >= LIMIT:
                    break
            if count >= LIMIT:
                break
            next_page = driver.find_element(By.ID, "lastCompMark").find_elements(
                By.XPATH, "//*[contains(text(), 'Next')]"
            )
            if next_page:
                page_no += 1
                driver.get(url + "-" + str(page_no))
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CLASS_NAME, "srp-jobtuple-wrapper")
                    )
                )
            else:
                break
        except Exception as error:
            print(error)
            break
    job_list = []
    for job in jobs:
        try:
            job["location"], job["description"] = get_job_details(driver, job["link"])
        except Exception as error:
            print(error)
            job["location"], job["description"] = None, None
        job_data = schemas.JobScrape.model_validate(job).model_dump()
        job_list.append(job_data)
    return job_list
