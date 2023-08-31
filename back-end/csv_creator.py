import web_scraping
from url_list import Url
import csv


def create_csv(url):
    # pulls the team abbreviation from the url
    csv_file_team = url.split('/')[-3]

    csv_file_name = (csv_file_team, " Schedule 2023-2024.")

    # fields names
    field_names = [
        ["date", 'oponnent', 'time', 'channel',]
    ]


# LIST OF ALL TEAM URLS  TO BE ITERATED THROUGH
urls = Url.nba_url_list

# loop creates a csv file for each team and their schedule.
for i in range(len(urls)):
    create_csv(urls[i])
