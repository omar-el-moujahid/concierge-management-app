from sqlalchemy import Column, Integer, DECIMAL, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class DetailsCommande(Base):
    __tablename__ = "details_commande"

    id_detail = Column(Integer, primary_key=True)
    id_commande = Column(Integer, ForeignKey("commande.id_commande"), nullable=False)
    id_produit = Column(Integer, ForeignKey("produit.id_produit"), nullable=False)
    prix_catalogue = Column(DECIMAL(10, 2), nullable=False)
    prix_applique = Column(DECIMAL(10, 2), nullable=False)
    quantite = Column(Integer, nullable=False)
    remise = Column(DECIMAL(5, 2), default=0)

    commande = relationship("Commande", back_populates="details")
    produit = relationship("Produit", back_populates="details")

