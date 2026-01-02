from sqlalchemy import Column, Integer, DECIMAL, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Facture(Base):
    __tablename__ = "facture"

    id_facture = Column(Integer, primary_key=True)
    date_facture = Column(Date, nullable=False)
    montant_commande = Column(DECIMAL(10, 2), nullable=False)
    frais_service = Column(DECIMAL(10, 2), default=0)
    frais_livraison = Column(DECIMAL(10, 2), default=0)
    remise = Column(DECIMAL(10, 2), default=0)
    montant_total = Column(DECIMAL(10, 2), nullable=False)
    id_commande = Column(Integer, ForeignKey("commande.id_commande"))

    commande = relationship("Commande", back_populates="facture")
    paiements = relationship("Paiement", back_populates="facture")
