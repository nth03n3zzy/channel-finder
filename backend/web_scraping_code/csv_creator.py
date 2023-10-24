import web_scraping
from url_list import Url
import csv


def create_csv(url):
    # pulls the team abbreviation from the url
    csv_file_team = url.split('/')[-3]

    csv_file_name = f"{csv_file_team} Schedule 2023-2024.csv"

    data = web_scraping.get_schedule('tr', 'Table__TR Table__TR--sm Table__even',
                                     'filled Table__TR Table__TR--sm Table__even', url)

    # fields names
    field_names = ['team', 'date', 'opponent', 'time', 'channel']

    # Write the data to the CSV file
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=field_names)
        writer.writeheader()  # Write the header row
        writer.writerows(data)  # Write the data rows


def create_csv_nhl(url):
    # pulls the team abbreviation from the url
    csv_file_team = url.split('/')[-2]

    csv_file_name = f"{csv_file_team} Schedule 2023-2024.csv"

    data = web_scraping.get_schedule_nhl('tr', 'Table__TR Table__TR--sm Table__even',
                                         'filled Table__TR Table__TR--sm Table__even', url)

    # fields names
    field_names = ['team', 'date', 'opponent', 'time', 'channel']

    # Write the data to the CSV file
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=field_names)
        writer.writeheader()  # Write the header row
        writer.writerows(data)  # Write the data rows


# LIST OF ALL TEAM URLS  TO BE ITERATED THROUGH
urls_nba = Url.nba_url_list
urls_nhl = Url.nhl_url_list

# create_csv_nhl(
#   'https://www.espn.com/nhl/team/schedule/_/name/bos/boston-bruins')

# loop creates a csv file for each team and their schedule.
for i in range(len(urls_nhl)):
    create_csv_nhl(urls_nhl[i])
