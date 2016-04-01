from flask import Flask, url_for, json, request, Response
from trueskill import Rating, rate_1vs1, rate

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
    curl -H "Content-type: application/json" -X POST http://127.0.0.1:5000/update_rank -d '[{ "name": "davm", "mu": 25.0, "sigma": 8.55, "rank": 1 }, { "name": "thom", "mu": 25.0, "sigma": 8.55, "rank": 1 }, { "name": "nels", "mu": 25.0, "sigma": 8.55, "rank": 2 }, { "name": "bigm", "mu": 25.0, "sigma": 8.55, "rank": 2 }]'

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
    ranks = list(set([l['rank'] for l in res_list]))

    for line in res_list:
        # winner if has the minimum rank
        key = 0 if line['rank'] == min(ranks) else 1
        value = line['name']
        if key in v.keys():
            v[key].append(value)
        else:
            v[key] = [value]
    return v


def get_new_ratings(players, teams):
    """
    Affect new ratings to players from teams results
    """
    nb_players_team0 = len(teams[0])
    nb_players_team1 = len(teams[1])
    winner = players[teams[0][0]]
    loser = players[teams[1][0]]
    if nb_players_team0 == 1 and nb_players_team1 == 1:
        new_r1, new_r3 = rate_1vs1(winner,loser)
    elif nb_players_team0 == 1 and nb_players_team1 > 1:
        team_loser = [loser, players[teams[1][1]]]
        (new_r1), (new_r3, new_r4) = rate([winner, team_loser], ranks=[0, 1])  
    elif nb_players_team0 > 1 and nb_players_team1 == 1:
        team_winner = [winner, players[teams[0][1]]]
        (new_r1, new_r2), (new_r3) = rate([team_winner, loser], ranks=[0, 1])  
    else:
        team_loser = [loser, players[teams[1][1]]]
        team_winner = [winner, players[teams[0][1]]]
        (new_r1, new_r2), (new_r3, new_r4) = rate([team_winner, team_loser], ranks=[0, 1])  
    player1 = {'name': teams[0][0], 'mu': new_r1.mu, 'sigma': new_r1.sigma}
    player3 = {'name': teams[1][0], 'mu': new_r3.mu, 'sigma': new_r3.sigma}
    if nb_players_team0 > 1:
        player2 = {'name': teams[0][1], 'mu': new_r2.mu, 'sigma': new_r2.sigma}
    if nb_players_team1 > 1:
        player4 = {'name': teams[1][1], 'mu': new_r4.mu, 'sigma': new_r4.sigma}
        if nb_players_team0 > 1:
            return [player1, player2, player3, player4]
        return [player1, player2, player4]
    return [player1, player3]


@app.route('/predict', methods=['POST'])
def predict():
    if request.headers['Content-Type'] == 'application/json':
        # get list of players scores
        # data = json.loads(request.data)
        # players = create_players(data)
        # teams = create_teams(data)
        return "I predict a win for david and thomas" 


@app.route('/update_rank', methods=['POST'])
def rank():
    if request.headers['Content-Type'] == 'application/json':
        try:
            data = json.loads(request.data)
        except Exception as e:
            return "\n Error cant load JSON ! \n"
        try:
            players = create_players(data)
        except Exception as e:
            return "\n Error cant create players ! \n"
        try:
            teams = create_teams(data)
        except Exception as e:
            return "\n Error cant create teams ! \n"
        return Response(json.dumps(get_new_ratings(players, teams)),
                        mimetype='application/json')
    else:
        return "415 Unsupported Format Type (use application/json)"


if __name__ == '__main__':
    app.run(debug=True)
