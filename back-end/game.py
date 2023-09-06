# file for making game objects, and any functions pertaining to formatting the info and data for a game object for display.

class Game:
    def __init__(self, date, opponent, time, channel):
        self.date = date
        self.opponent = opponent
        self.time = time
        self.channel = channel

    def __str__(self):
        return f"Date: {self.date}, Opponent: {self.opponent}, Time: {self.time}, Channel: {self.channel}"
