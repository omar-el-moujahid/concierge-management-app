from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum
from models.enums import StatusCommande
class Commande(Base):
    __tablename__ = "commande"

    id_commande = Column(Integer, primary_key=True)
    date_commande = Column(Date)
    date_arriver = Column(Date)
    status = Column(Enum(StatusCommande), nullable=False)
    note = Column(String(255))
    id_client = Column(Integer, ForeignKey("client.id_client"))

    client = relationship("Client", back_populates="commandes")
    details = relationship("DetailsCommande", back_populates="commande")
    facture = relationship("Facture", back_populates="commande", uselist=False)
