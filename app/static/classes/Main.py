import json
from .Create import Create

def rightJson(jsonFile, data):
    with open("./static/data/" + jsonFile, "w") as turn_file:
        json.dump(data, turn_file, indent=4)

""" ---------- Transfer in json of objects ---------- """

# Initate Create object #
create = Create()

# Initate Movments objects #
pawnSM = create.pawnSpecialMoove()
pawnEM = create.pawnEatMoove()
pawnNM = create.pawnNormalMoove()

bishopM = create.bishopMoove()
knightM = create.knightMoove()
rookM = create.rookMoove()

queenM = create.queenMoove()
kingM = create.kingMoove()

# Initate Pieces objects #
pawnP = create.Pawn(0)

bishopP = create.Bishop()
knightP = create.Knight()
rookP = create.Rook()

queenP = create.Queen()
kingP = create.King()

# Transfer Piece objects to JSON #
data = {
    "pawnSM": [pawnSM.getType(), pawnSM.getMinBoxNbr(), pawnSM.getMaxBoxNbr(), pawnSM.getMooveBack(), pawnSM.getJump()],
    "pawnEM": [pawnEM.getType(), pawnEM.getMinBoxNbr(), pawnEM.getMaxBoxNbr(), pawnEM.getMooveBack(), pawnEM.getJump()],
    "pawnNM": [pawnNM.getType(), pawnNM.getMinBoxNbr(), pawnNM.getMaxBoxNbr(), pawnNM.getMooveBack(), pawnNM.getJump()],
    "bishopM": [bishopM.getType(), bishopM.getMinBoxNbr(), bishopM.getMaxBoxNbr(), bishopM.getMooveBack(), bishopM.getJump()],
    "knightM": [knightM.getType(), knightM.getMinBoxNbr(), knightM.getMaxBoxNbr(), knightM.getMooveBack(), knightM.getJump()],
    "rookM": [rookM.getType(), rookM.getMinBoxNbr(), rookM.getMaxBoxNbr(), rookM.getMooveBack(), rookM.getJump()],
    "queenM": [queenM.getType(), queenM.getMinBoxNbr(), queenM.getMaxBoxNbr(), queenM.getMooveBack(), queenM.getJump()],
    "kingM": [kingM.getType(), kingM.getMinBoxNbr(), kingM.getMaxBoxNbr(), kingM.getMooveBack(), kingM.getJump()],
    "pawnP": [pawnP.getType(), pawnP.getMinBoxNbr(), pawnP.getMaxBoxNbr(), pawnP.getMooveBack(), pawnP.getJump(), pawnP.getId(), pawnP.getName(), pawnP.getColor()],
    "bishopP": [bishopP.getType(), bishopP.getMinBoxNbr(), bishopP.getMaxBoxNbr(), bishopP.getMooveBack(), bishopP.getJump(), bishopP.getId(), bishopP.getName(), bishopP.getColor()],
    "knightP": [knightP.getType(), knightP.getMinBoxNbr(), knightP.getMaxBoxNbr(), knightP.getMooveBack(), knightP.getJump(), knightP.getId(), knightP.getName(), knightP.getColor()],
    "rookP": [rookP.getType(), rookP.getMinBoxNbr(), rookP.getMaxBoxNbr(), rookP.getMooveBack(), rookP.getJump(), rookP.getId(), rookP.getName(), rookP.getColor()],
    "queenP": [queenP.getType(), queenP.getMinBoxNbr(), queenP.getMaxBoxNbr(), queenP.getMooveBack(), queenP.getJump(), queenP.getId(), queenP.getName(), queenP.getColor()],
    "kingP": [kingP.getType(), kingP.getMinBoxNbr(), kingP.getMaxBoxNbr(), kingP.getMooveBack(), kingP.getJump(), kingP.getId(), kingP.getName(), kingP.getColor()]
}

rightJson("game.json", data)
