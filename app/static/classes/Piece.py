from .Movment import Movment


class Piece(Movment):

    def __init__(self, type, minBoxNbr, maxBoxNbr, mooveBack, jump, id, name, color):
        Movment.__init__(self, type, minBoxNbr, maxBoxNbr, mooveBack, jump)
        self.id = id
        self.name = name
        self.color = color

    def __repr__(self):
        return self.name + self.color

    def getId(self):
        return self.id

    def getName(self):
        return self.name

    def getColor(self):
        return self.color