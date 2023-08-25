from bs4 import BeautifulSoup
import requests
import pytz
from datetime import datetime, timedelta

url = "https://www.espn.com/nba/team/schedule/_/name/bos/seasontype/2/boston-celtics"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

page = requests.get(url, headers=headers)

doc = BeautifulSoup(page.text, "html.parser")

# Find all rows with class "Table__TR--sm" row 0 is the heading for the table so it will need to be skipped.
oddRows = doc.find_all('tr', class_='Table__TR Table__TR--sm Table__even')[14]

evenRows = doc.find_all(
    'tr', class_='filled Table__TR Table__TR--sm Table__even')[13]

# function to find the date contained in the row that is being inputted.


def find_date(row):

    # date of games is found in the first span tag.
    date = row.find("span").text

    return date

# function to find the opponent contained in the row being searcehd.


def find_opponent(row):

    # opponent title is dound in a anchor tab
    opponent_element = oddRows.find_next('a', tabindex='0')

    # the name is contained in the href for this anchor tab this is an example of the print out
    # "/nba/team/_/name/ny/new-york-knicks"
    opponent_href = opponent_element['href']

    # .split('/') seperates the string into a list each element corresponding to where the
    # slash is ['', 'nba', 'team', '_','name','ny','new-york-knicks']. the [-1] tells the
    # split to grab the last item in the list reverse indexing in python -1 is the last
    # item -2 is the second to last item and so forth.
    team_name_abbreviation = opponent_href.split('/')[-1]

    # replacing all '-' with ' ' so the team name looks like a normal team name. "new york knicks"
    team_name = team_name_abbreviation.replace('-', ' ')

    return team_name

# function to find the game time of the row entered.


def find_time(row):
    time_element = oddRows.find_all('td', class_='Table__TD')[2]

    time_est = time_element.text.strip()

    return time_est

# function to find what channel the game is on.
# def find_channel(row):


def find_channel(row):
    channel_element = row.find_all('td', class_='Table__TD')[3]

    if (channel_element.find('div', class_='network-container')):

        if (channel_element.find('figure')):

            channel_figure = channel_element.find('figure')

            channel_long = channel_figure['class'][-1]
            channel_break = channel_long.split('-')
            channel = channel_break[-1]

            print(len(channel_element.find_all('figure')))
            if(channel_figure.find('figure')):
                print('second channel found')
                channel_list = [channel]

                second_channel = channel_figure.find('figure')

                second_channel_long = second_channel['class'][-1]
                second_channel_break = second_channel_long.split('-')
                second_channel_channnel = second_channel_break[-1]

                channel_list.append(second_channel_channnel)

                return channel_list

            return channel
        channel = channel_element.find('div').text

        return channel

    channel = "NBA League Pass"

    return channel


print(find_date(oddRows))
print((find_channel(oddRows)))
# print(channel)
