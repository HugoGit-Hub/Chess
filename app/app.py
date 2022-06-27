from static.classes import Main
from flask import Flask, json, render_template, request
import os
from flask_fontawesome import FontAwesome

app = Flask(__name__)
fa = FontAwesome(app)

with open('./static/data/savedBoard.json', 'r') as jsonBoard:
    savedBoard = json.load(jsonBoard)

with open('./static/data/game.json', 'r') as jsonGame:
    game = json.load(jsonGame)

dataJson = [
    savedBoard, 
    game,
    {
        "player":[
            {
                "name":"",
                "turn":1,
                "defeat":0,
                "victory":0
            },
            {
                "name":"",
                "turn":0,
                "defeat":0,
                "victory":0
            }
        ]
    }
]

with open('./static/data/game.json', 'w') as jsonDataGame:
    preparedGame = json.dump(dataJson, jsonDataGame, indent=4)



@app.route("/")
def chess():

    with open('./static/data/game.json') as dataJson:
        players = json.load(dataJson)
        namePleyrOne = players[2]["player"][0]["name"]
        namePleyrTwo = players[2]["player"][1]["name"]

    if namePleyrOne == "" or namePleyrTwo == "":
        return render_template('user.html')

    return render_template('home.html', player_one_name=namePleyrOne, player_two_name=namePleyrTwo)



@app.route('/userName', methods=['POST'])
def user():
    namePlayerOne = request.form['playerOne']
    namePlayerTwo = request.form['playerTwo']

    with open("./static/data/game.json") as jsonFile:
        data = json.load(jsonFile)
        data[2]["player"][0]["name"] = namePlayerOne
        data[2]["player"][1]["name"] = namePlayerTwo

    with open("./static/data/game.json", "w") as dump_json:
        json.dump(data, dump_json, indent=4)

    return chess()



@app.route("/game", methods=['GET', 'POST'])
def game():

    board = 8

    return render_template('game.html', board=board)



@app.route("/playerOne")
def playerOne():
    jsonUrl = os.path.join("static/", "data/", "game.json")
    dataJson = json.load(open(jsonUrl))

    data = dataJson[2]["player"]
    namePlayer = data[0]['name']
    victoryPlayer = data[0]['victory']
    defeatPlayer = data[0]['defeat']

    return render_template('player.html', player_name=namePlayer, player_victory=victoryPlayer, player_defeat=defeatPlayer)



@app.route("/playerTwo")
def playerTwo():
    jsonUrl = os.path.join("static/", "data/", "game.json")
    dataJson = json.load(open(jsonUrl))

    data = dataJson[2]['player']
    namePlayer = data[1]['name']
    victoryPlayer = data[1]['victory']
    defeatPlayer = data[1]['defeat']

    return render_template('player.html', player_name=namePlayer, player_victory=victoryPlayer, player_defeat=defeatPlayer)



if __name__ == "__main__":
    app.run(debug=True)