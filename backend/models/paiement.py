from sqlalchemy import Column, Integer, DECIMAL, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Paiement(Base):
    __tablename__ = "paiement"

    id_paiement = Column(Integer, primary_key=True)
    paiement_bank = Column(DECIMAL(10, 2))
    date_bank = Column(Date)
    paiement_cash = Column(DECIMAL(10, 2))
    date_cash = Column(Date)
    id_facture = Column(Integer, ForeignKey("facture.id_facture"))

    facture = relationship("Facture", back_populates="paiements")

