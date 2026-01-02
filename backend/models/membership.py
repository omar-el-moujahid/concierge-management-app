from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
class Membership(Base):
    __tablename__ = "membership"

    id_membership = Column(Integer, primary_key=True)
    type_membership = Column(String(50))
    min_points = Column(Integer)
    benefit_description = Column(String(255))

    cartes = relationship("CartFidelite", back_populates="membership")
