from http.client import HTTPException
import token
from fastapi import FastAPI , Depends
from database import engine, Base
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.telephone import Telephone
from models.produit import Produit
from models.commande import Commande
from models.facture import Facture
from models.paiement import Paiement
from models.categorie import Categorie
from models.commande import Commande
from models.admin import Admin
from models.detailsCommande import DetailsCommande
from sqlalchemy.orm import selectinload
from core.security import verify_password, create_access_token
from schemas.auth import LoginAdmin
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from core.security import JWTError, SECRET_KEY, ALGORITHM
from routes import client_routes
from sqlalchemy.orm import selectinload

app = FastAPI()

# ========================Authentication=======================
@app.post("/auth/login")
async def login_admin(data: LoginAdmin, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Admin).where(Admin.email == data.email))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(data.password, admin.hash_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte administrateur désactivé"
        )
    
    token = create_access_token({
        "sub": admin.email,
        "is_super_admin": admin.is_super_admin
    })
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/")
def root():
    return {"message": "Conciergerie API running"}

# =======================Client===============================

app.include_router(client_routes.router)

# ======================================================
