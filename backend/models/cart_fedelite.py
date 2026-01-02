from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey , Date
from database import Base

class CartFidelite(Base):
    __tablename__ = "cart_fidelite"

    id_cart = Column(Integer, primary_key=True)
    point = Column(Integer)
    date_d_exp = Column(Date)
    id_client = Column(Integer, ForeignKey("client.id_client"), nullable=False)
    id_membership = Column(Integer, ForeignKey("membership.id_membership"))

    client = relationship("Client", back_populates="cartes")
    membership = relationship("Membership", back_populates="cartes")
