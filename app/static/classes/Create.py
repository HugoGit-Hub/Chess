from .Piece import Piece
from .Movment import Movment


class Create():

    # ----------
    # Movments
    # ----------

    def pawnSpecialMoove(self):
        moove = Movment("straight", 2, 2, False, False)
        return moove

    def pawnNormalMoove(self):
        moove = Movment("straight", 1, 1, False, False)
        return moove

    def pawnEatMoove(self):
        moove = Movment("diagonal", 1, 1, False, False)
        return moove

    def bishopMoove(self):
        moove = Movment("diagonal", 1, 8, True, False)
        return moove

    def knightMoove(self):
        moove = Movment("moove_l", 4, 4, True, True)
        return moove

    def rookMoove(self):
        moove = Movment("straight_line", 1, 8, True, False)
        return moove

    def queenMoove(self):
        moove = Movment("every_mooves", 1, 8, True, False)
        return moove

    def kingMoove(self):
        moove = Movment("around_king", 1, 1, True, False)
        return moove

    # ----------
    #  pieces
    # ----------

    def Pawn(self, choose):
        if choose == 0:
            moove = self.pawnSpecialMoove()
        elif choose == 1:
            moove = self.pawnEatMoove()
        else:
            moove = self.pawnNormalMoove()
        piece = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 0, "pawn", "")
        return piece

    def Bishop(self):
        moove = self.bishopMoove()
        piece = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 1, "bishop", "")
        return piece

    def Knight(self):
        moove = self.knightMoove()
        piece = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 2, "knight", "")
        return piece

    def Rook(self):
        moove = self.rookMoove()
        piece = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 3, "rook", "")
        return piece

    def Queen(self):
        moove = self.queenMoove()
        piece = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 4, "queen", "")
        return piece

    def King(self):
        moove = self.kingMoove()
        peice = Piece(moove.getType(), moove.getMinBoxNbr(), moove.getMaxBoxNbr(), moove.getMooveBack(), moove.getJump(), 5, "king", "")
        return peice
