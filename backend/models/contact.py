from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.orm import relationship
class Contact(Base):
    __tablename__ = "contact"

    id_contact = Column(Integer, primary_key=True)
    instagram = Column(String(100))
    facebook = Column(String(100))
    email = Column(String(150))
    adresse_postale = Column(String(255))
    id_client = Column(Integer, ForeignKey("client.id_client"), unique=True)

    client = relationship("Client", back_populates="contact")
    telephones = relationship("Telephone", back_populates="contact")
