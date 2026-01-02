from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.orm import relationship

class Telephone(Base):
    __tablename__ = "telephone"

    id_telephone = Column(Integer, primary_key=True)
    numero = Column(String(20))
    type = Column(String(30))
    id_contact = Column(Integer, ForeignKey("contact.id_contact"))

    contact = relationship("Contact", back_populates="telephones")
