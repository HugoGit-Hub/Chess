class Movment:

    def __init__(self, type, minBoxNbr, maxBoxNbr, mooveBack, jump):
        self.type = type
        self.minBoxNbr = minBoxNbr
        self.maxBoxNbr = maxBoxNbr
        self.mooveBack = mooveBack
        self.jump = jump

    def getType(self):
        return self.type

    def getMinBoxNbr(self):
        return self.minBoxNbr

    def getMaxBoxNbr(self):
        return self.maxBoxNbr

    def getMooveBack(self):
        return self.mooveBack

    def getJump(self):
        return self.jump