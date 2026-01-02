from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum
from models.enums import StatusProduit
class Produit(Base):
    __tablename__ = "produit"

    id_produit = Column(Integer, primary_key=True)
    status = Column(Enum(StatusProduit), nullable=False)
    libelle = Column(String(100))
    prix_catalogue = Column(DECIMAL(10, 2))
    id_categorie = Column(Integer, ForeignKey("categorie.id_categorie"))

    categorie = relationship("Categorie", back_populates="produits")
    details = relationship("DetailsCommande", back_populates="produit")

