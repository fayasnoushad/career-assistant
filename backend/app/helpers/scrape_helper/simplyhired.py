from datetime import datetime, timezone
from ... import schemas
from typing import List
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ...configs import MIN_JOB_LIMIT as LIMIT


URL = "https://www.simplyhired.co.in/search?q={}&l=India"


def get_salary(salary_text: str) -> int:
    salary_text = salary_text.replace("From", "").replace("Up to", "")
    salary_info, month_or_year = salary_text.split(" a ")
    salary_info = salary_info.replace(",", "").replace("₹", "").replace(" ", "")
    if "-" in salary_info:
        salary = sum([float(sal) for sal in salary_info.split("-")]) / 2
    else:
        salary = float(salary_info)
    if month_or_year == "year":
        salary /= 12
    return int(salary)


def parse(job_name: str, driver: webdriver.Firefox) -> List[dict]:
    url = URL.format(job_name.replace(" ", "+"))
    driver.get(url)
    jobs = []
    prev_job_description = None
    count = 0
    while True:
        try:
            job_list = driver.find_elements(
                By.CSS_SELECTOR, "[data-testid='searchSerpJob']"
            )
            for job in job_list:
                job.click()
                if prev_job_description:
                    WebDriverWait(driver, 10).until(
                        EC.staleness_of(prev_job_description)
                    )
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (
                            By.CSS_SELECTOR,
                            "[data-testid='viewJobBodyJobFullDescriptionContent']",
                        )
                    )
                )
                prev_job_description = driver.find_element(
                    By.CSS_SELECTOR,
                    "[data-testid='viewJobBodyJobFullDescriptionContent']",
                )
                name = job.find_element(By.CLASS_NAME, "css-16lgz6b").text
                link = job.find_element(By.CLASS_NAME, "css-16lgz6b").get_attribute(
                    "href"
                )
                company = ""
                location = ""
                try:
                    company = job.find_element(
                        By.CSS_SELECTOR, "[data-testid='companyName']"
                    ).text
                except:
                    pass
                try:
                    location = job.find_element(
                        By.CSS_SELECTOR, "[data-testid='searchSerpJobLocation']"
                    ).text
                except:
                    pass
                try:
                    salary = job.find_element(
                        By.CSS_SELECTOR,
                        "[data-testid='searchSerpJobSalaryConfirmed']",
                    )
                    salary = get_salary(salary.text) if salary else None
                except:
                    salary = None
                try:
                    description_element = driver.find_element(
                        By.CSS_SELECTOR,
                        "[data-testid='viewJobBodyJobFullDescriptionContent']",
                    )
                    description_content = []
                    for element in description_element.find_elements(By.XPATH, "./*"):
                        description_content.append(element.text)
                    description = "\n\n".join(description_content)
                except:
                    description = ""
                job_data = {
                    "name": name,
                    "company": company,
                    "location": location,
                    "salary": salary,
                    "link": link,
                    "description": description,
                    "time": str(datetime.now(timezone.utc)),
                }
                job = schemas.JobScrape.model_validate(job_data).model_dump()
                jobs.append(job)
                count += 1
                if count >= LIMIT:
                    break
            if count >= LIMIT:
                break
            prev_job_description = None
            next_page = driver.find_element(
                By.CSS_SELECTOR, "[data-testid='pageNumberBlockNext']"
            )
            if next_page:
                first_job = driver.find_element(
                    By.CSS_SELECTOR, "[data-testid='searchSerpJob']"
                )
                next_page.click()
                WebDriverWait(driver, 10).until(EC.staleness_of(first_job))
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "[data-testid='searchSerpJob']")
                    )
                )
            else:
                break
        except Exception as error:
            print(error)
            break
    return jobs
