from flask import Flask, url_for, json, request
import trueskill
from trueskill import Rating, quality_1vs1, rate_1vs1, rate_2vs2, rate

app = Flask(__name__)

"""
Python Flask Application for ranking

JSON message should be like :
    var yolo = [
      {
          "name": "davm",
          "mu": 25.0,
          "sigma": 8.55,
          "rank": 1
      },
      {
          "name": "thom",
          "mu": 25.0,
          "sigma": 8.55,
          "rank": 1
      },
      {
          "name": "nels",
          "mu": 25.0,
          "sigma": 8.55,
          "rank": 2
      },
      {
          "name": "bigm",
          "mu": 25.0,
          "sigma": 8.55,
          "rank": 2
      }
    ];

To test :
    curl -H "Content-type: application/json" -X POST http://127.0.0.1:5000/rank -d '[{ "name": "davm", "mu": 25.0, "sigma": 8.55, "rank": 1 }, { "name": "thom", "mu": 25.0, "sigma": 8.55, "rank": 1 }, { "name": "nels", "mu": 25.0, "sigma": 8.55, "rank": 2 }, { "name": "bigm", "mu": 25.0, "sigma": 8.55, "rank": 2 }]'

"""


@app.route('/')
def api_root():
    return 'Welcome to Ranking App'


def create_players(res_list):
    """
    Creates a dict of {'player_name': player_rating} for each list items
    """
    return {p['name']: Rating(mu=p['mu'], sigma=p['sigma']) for p in res_list}


def create_teams(res_list):
    """
    Creates a dict of {'team_number': ['player_name1', 'player_name2']}
    for each list items
    """
    v = {}
    for line in res_list:
        key = line['rank']
        value = line['name']
        if key in v.keys():
            v[key].append(value)
        else:
            v[key] = [value]
    return v


def get_new_ratings():
    pass


@app.route('/rank', methods=['POST'])
def api_message():
    if request.headers['Content-Type'] == 'application/json':
        # get list of players scores
        data = json.loads(request.data)
        nb_players = len(data)
        players = create_players(data)
        if nb_players == 4:
            teams = create_teams(data)
            return 'This is a 2v2 match'
        elif nb_players == 2:
            return 'This is a 1v1 match'
        elif nb_players == 3:
            teams = create_teams(data)
            (new_r1,),
            (new_r2, new_r3) = rate([teams[0], teams[1]], ranks=[0, 1])
            return 'This is a 1v2 match'
        else:
            return 'Invalid number of players'
        # return "JSON Message: " + json.dumps(dataDict) + '\n'
    else:
        return "415 Unsupported Format Type (use application/json)"


if __name__ == '__main__':
    app.run()
