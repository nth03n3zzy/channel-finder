Project Title:

    Channel Finder

Intro:

    Hello, I'm Anthony Collins, and I've developed this application for a specific purpose. When searching online for the TV channel broadcasting a sports game, there are a few issues. If you're a working-class individual, you might watch the game on delay to avoid spoilers. However, visiting sites like ESPN.com or using Google often results in seeing the current score right away. Additionally, using Google to find the broadcast channels is a cumbersome process—selecting the game and then locating the 'watch live' button. As a user, I've found this process frustrating.

    This frustration led me to create Channel Finder, a web app built using Django and React. It allows users to select their sport and team, instantly displaying the next game's date, time, and channel at the top of the page. Future games for the selected team are listed below, ensuring no scores are spoiled.

Features:

    *  Web Scraping:
            Channel Finder uses Beautiful Soup to scrape ESPN's NBA, NFL, and NHL schedules. As of November 2023, the MLB schedule is not available. Upon the release of the next MLB season's schedule, functionality will be added to include it. The web scraping code is contained in "backend/web_scraping_code/web_scraping.py." The scraped data is automatically cleaned and organized into CSV files, which can be imported into the respective sports schedule folders. Using a custom command, "python manage.py import_csv," the CSV files can be added to the Django database.

    *   Time-Zone, date and location handling:

            The application handles different time zones and locations. Initially scraped in EST, the times are stored in the database in UTC. When data is sent to the front end via API requests, it's converted from UTC to the user's selected time zone. This accommodates users across the international date line, ensuring accurate game times.

            Users can adjust their system date and time settings, although this might not be entirely reliable due to browser and network settings. Chrome, for instance, might use IP addresses or cache data to determine the user's time zone. The user's date is used to filter out past games with a four-hour buffer. This allows late starters to avoid score spoilers, displaying the current game for up to four hours past the start time. Games are otherwise filtered out based on the current date and time.

    *   Time God Mode:

            Time god mode was a feature I made because I realized the challenges of showcasing the time changing features of the app it may be inconvenient for users to change their system time and date settings, they may not know how, or their browser may be making it hard depending where its sourcing the time and location data from. Additionally I realised if people are checking this app out between sports seasons and theres no games displayed because new schedules have not been released yet. well then this web app will not be very interesting or impressive.

            So with that Time God Mode was created where the user can turn it on by selecting the check box at which point drop downs will appear to select the time zone, date and time. the user simply selects their desired values and then clicks apply and the schedules will be repopulated to reflect the selected date and times. when the user deselects time god mode, the schedule will revert back to what it should be based on the users system settings or what their browser believed the date and time are.

    * Foreign Market Channel Information:

            Lastly, as stated before, the data is scraped from ESPN. ESPN does not provide data for what channel the games may be on in foreign markets. So depending on the user's location, the channel information might be as good as the source, and I apologize for that. If I can figure out a more reliable source for global channel data, this may be fixed in the future.

Pre-requisites:

    Node.js: Required for running the React frontend. You can download and install it from the Node.js website.

    npm (Node Package Manager): Usually installed along with Node.js, this is used to manage React project dependencies.

    Python: Necessary for the Django backend. You can download and install Python from the Python Software Foundation.

    Django: Install Django using pip, Python's package installer, via the command:
        pip (or pip3) install django

    Beautiful Soup: Required for web scraping in the backend. You can install it via pip:
        pip (or pip3)  install beautifulsoup4


    React Dependencies: Inside the React project directory, run:


        npm install

    This installs all the dependencies listed in the package.json file for the React application.

Installation:

    To run the application locally, follow these steps:

    Clone the Repository:

        Download all files for the frontend and backend by cloning the repository to your local machine.

    Install Prerequisites:

        Ensure you have all the necessary software and tools installed as listed in the 'Prerequisites' section.

    Backend Setup:

        Open the terminal in your selected Integrated Development Environment (IDE).

        Navigate to the backend directory using the command:


            cd backend

        Activate the virtual environment by running:

            source backend/myenv/bin/activate


        Start the Django server by executing:

            python manage.py runserver

    Frontend Setup:

        Open a separate terminal in your IDE.

        Change the directory to where the frontend is located:

            cd channel-finder

        Start the React server by running:

            npm start

    This will launch a local instance of Channel Finder in your web browser. Enjoy using the application!

Usage:

    The following is directions on how to use the application.

    First read through and follow the stepd in the pre-requisite and installation sections. That will take you through how to get the application running in a local instance.

Technologies Used:

    *FrontEnd:

        React.js - javascript library used for building the user interface using a component style approach.
        Node.js - javaScript runtime for the react environment.
        npm - node package manager for managing dependencies.
        HTML/CSS - mark up and styling languages used for web development.
        Javascript - langauge used for front end logic and calculations.

    * backend:

        Django - python backend framework used for web development.
        BeautifulSoup - python library for web scraping.
        Python - langauge used for backend scripting.
        SQLite - database system used for schedule storage.

API Documentation:

    The application doesn't expose a public API. However, the backend uses internal APIs to communicate between the frontend and backend systems. These APIs facilitate data transfer and management between the React front end and the Django back end.

    Specific endpoints and their functionalities are not directly accessible from outside the application as the main purpose is to serve internal processes. For internal documentation on the APIs and endpoints, the codebase comments and relevant documentation within the project would be the reference points for developers working on the system.

Deployment:

    ******************* PENDING

Known Issues:

    There is no support or account for local markets, it is very hard to find a complete data set for local markets. If someone knows of one please feel free to reach out to me.

Acknowledgments:

    I would like to thank google and the many times looking up the channel for the warriors game has been a completely frustrating  process leading me to take the time to make this application for myself.

Contact:

    Email: aco1147@wgu.edu

    LinekdIn: https://www.linkedin.com/in/anthony-m-collins/
