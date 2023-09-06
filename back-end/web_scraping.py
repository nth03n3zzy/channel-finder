from url_list import Url
from datetime import datetime, timedelta
from game import Game
import requests
from bs4 import BeautifulSoup
import sys
sys.path.append('/Users/daddy/Desktop/web_scraper_NBA/channel-finder/back-end')


url = "https://www.espn.com/nba/team/schedule/_/name/ny/seasontype/2"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

page = requests.get(url, headers=headers)

doc = BeautifulSoup(page.text, "html.parser")

# Find all rows with class "Table__TR--sm" row 0 is the heading for the table so it will need to be skipped.
oddRows = doc.find_all('tr', class_='Table__TR Table__TR--sm Table__even')[1]

evenRows = doc.find_all(
    'tr', class_='filled Table__TR Table__TR--sm Table__even')

# function to find the date contained in the row that is being inputted.


def get_team_name(url):
    name_list = url.split('/')[-1]
    name = name_list.replace('-', ' ')
    print(name)


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

    # takes us to the table data tag that contains channel information.
    channel_element = row.find_all('td', class_='Table__TD')[3]

    # checks if there is a div tag with the class network container
    if channel_element.find('div', class_='network-container'):
        # check if there is a figure tag nested within
        if channel_element.find('figure'):

            channel_figures = channel_element.find_all(
                'figure')  # Find all figure tags

            # List to store channel information since there can be more than one channel
            channel_list = []

            # for loop that will iterate through all the figure tags
            for figure in channel_figures:
                # grabs the last element from the class tag channel_long will look like "network-'netwrok name such as espn'""
                channel_long = figure['class'][-1]
                # removes the hifen so chanel_break = ['network','espn'].
                channel_break = channel_long.split('-')
                # we grab the last element channel = 'espn'.
                channel = channel_break[-1]
                # we add the channel to the channel list.
                channel_list.append(channel)

            return channel_list  # channel list is returned.

        # if the div tag does not have a figure than the channel is in the text of the div tag.
        channel = channel_element.find('div').text
        return channel

    channel = "NBA League Pass"
    return channel

# function to print out the schedule, tag must be passed in as well as class names for the rows, written around the html for the celtics
# schedule. may have to configured for other teams.


def print_schedule(tag, class_odd_rows, class_even_rows, url):
    # sets header for scrapper so queries appear to come from a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

    # page data requests.get
    page = requests.get(url, headers=headers)

    # parsing doc
    doc = BeautifulSoup(page.text, "html.parser")

    # finding all the data for all odd rows
    oddrows = doc.find_all(tag, class_=class_odd_rows)

    # finding the data for all even rows cause they have a seperate tag
    evenrows = doc.find_all(tag, class_=class_even_rows)

    # for some reason the person who did the front end for espn gave the last row a sepereate class name.
    lastrow = doc.find_all(
        tag, 'filled bb--none Table__TR Table__TR--sm Table__even')[0]

    # min length calculated for looping and printing logic because the number of even and odd rows are not the same
    # but we alternate between even and odd so we need to know at what index to stop getting info from the shorter list
    # so that we dont get an index out of bounds error.
    min_length = min(len(oddrows), len(evenrows))

    # team name scraped from url to use to state the teams schedule we are scraping.
    team_name = url.split('/')[-3]

    print('------------------', team_name,
          ' schedule ------------------------')

    # for loop alternating between even and odd rows. first odd row is skipped because it jsut contains header information
    for n in range(min_length):

        game = Game(find_date(evenrows[n]), find_opponent(
            evenrows[n]), find_time(evenrows[n]), find_channel(evenrows[n]))
        print(game)

        # if statement is logic to skip first odd row as it is just table header info.
        if(n > 0):
            game = Game(find_date(oddrows[n]), find_opponent(
                oddrows[n]), find_time(oddrows[n]), find_channel(oddrows[n]))
            print(game)

    # since we stop printing after min length we need to print the last odd row
    game = Game(find_date(oddrows[40]), find_opponent(
        oddrows[40]), find_time(oddrows[40]), find_channel(oddrows[40]))
    print(game)

    # and since they gave the last row a different class we also have seperate print commands for that.
    game = Game(find_date(lastrow), find_opponent(lastrow),
                find_time(lastrow), find_channel(lastrow))
    print(game)


def get_schedule(tag, class_odd_rows, class_even_rows, url):

    # sets header for scrapper so queries appear to come from a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

    # page data requests.get
    page = requests.get(url, headers=headers)

    # parsing doc
    doc = BeautifulSoup(page.text, "html.parser")

    # finding all the data for all odd rows
    oddrows = doc.find_all(tag, class_=class_odd_rows)

    # finding the data for all even rows cause they have a seperate tag
    evenrows = doc.find_all(tag, class_=class_even_rows)

    # for some reason the person who did the front end for espn gave the last row a sepereate class name.
    lastrow = doc.find_all(
        tag, 'filled bb--none Table__TR Table__TR--sm Table__even')[0]

    schedule_data = []

    # min length calculated for looping and printing logic because the number of even and odd rows are not the same
    # but we alternate between even and odd so we need to know at what index to stop getting info from the shorter list
    # so that we dont get an index out of bounds error.
    min_length = min(len(oddrows), len(evenrows))

    # for loop alternating between even and odd rows. first odd row is skipped because it jsut contains header information

    for n in range(min_length):

        date = find_date(evenrows[n])
        opponent = find_opponent(evenrows[n])
        time = find_time(evenrows[n])
        channel = find_channel(evenrows[n])

        data_dictionary = {'date': date,
                           'opponent': opponent,
                           'time': time,
                           'channel': channel}

        schedule_data.append(data_dictionary)

        # if statement is logic to skip first odd row as it is just table header info.
        if(n > 0):
            date = find_date(oddrows[n])
            opponent = find_opponent(oddrows[n])
            time = find_time(oddrows[n])
            channel = find_channel(oddrows[n])

            data_dictionary = {'date': date,
                               'opponent': opponent,
                               'time': time,
                               'channel': channel}

            schedule_data.append(data_dictionary)

    # since we stop printing after min length we need to print the last odd row
    date = find_date(oddrows[40])
    opponent = find_opponent(oddrows[40])
    time = find_time(oddrows[40])
    channel = find_channel(oddrows[40])

    data_dictionary = {'date': date,
                       'opponent': opponent,
                       'time': time,
                       'channel': channel}

    schedule_data.append(data_dictionary)

    # and since they gave the last row a different class we also have seperate print commands for that.
    date = find_date(lastrow)
    opponent = find_opponent(lastrow)
    time = find_time(lastrow)
    channel = find_channel(lastrow)

    data_dictionary = {'date': date,
                       'opponent': opponent,
                       'time': time,
                       'channel': channel}

    schedule_data.append(data_dictionary)

    return schedule_data

# need to make function to create csvs for each team using the get_schedule function
# and iterate through to make a csv for each team
# also need a function to pull the team name from the end of the url and use that to be the csv name.
# ADD FUNSTIONALITY FOR HOME OR AWAY


urls = Url.nba_url_list

print_schedule('tr', 'Table__TR Table__TR--sm Table__even', 'filled Table__TR Table__TR--sm Table__even',
               'https://www.espn.com/nba/team/schedule/_/name/ny/seasontype/2')

# print(find_opponent(oddRows))

# print(find_date(oddRows))
