from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class Client(Base):
    __tablename__ = "client"

    id_client = Column(Integer, primary_key=True, index=True)
    nom_client = Column(String(100))
    prenom_client = Column(String(100))

    contact = relationship("Contact", back_populates="client", uselist=False)
    commandes = relationship("Commande", back_populates="client")
    cartes = relationship("CartFidelite", back_populates="client")

