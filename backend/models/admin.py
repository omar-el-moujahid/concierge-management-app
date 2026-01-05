from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Admin(Base):
    __tablename__ = "admins"

    id_admin = Column(Integer, primary_key=True, index=True)

    nom = Column(String(50), nullable=False)
    prenom = Column(String(50), nullable=False)
    contact = Column(String(20), nullable=False)

    email = Column(String(100), unique=True, nullable=False, index=True)
    hash_password = Column(String(255), nullable=False)

    is_super_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
