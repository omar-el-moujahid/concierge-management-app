from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Categorie(Base):
    __tablename__ = "categorie"

    id_categorie = Column(Integer, primary_key=True)
    libelle = Column(String(100))

    produits = relationship("Produit", back_populates="categorie")


