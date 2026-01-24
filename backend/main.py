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
from core.security import get_current_admin, verify_password, create_access_token
from schemas.auth import LoginAdmin
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from core.security import JWTError, SECRET_KEY, ALGORITHM
from routes import client_routes, commande_routes
from sqlalchemy.orm import selectinload
# pour ajouter des en-têtes CORS
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Remplacez par l'URL de votre frontend
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,  
    allow_methods=["*"],  # POST, GET, OPTIONS, PUT, DELETE
    allow_headers=["*"], # Autoriser tous les en-têtes
)

# root endpoint
@app.get("/")
def root():
    return {"message": "Conciergerie API running"}
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

# Dependency to get current admin

@app.get("/auth/me")
async def me(admin: Admin = Depends(get_current_admin),db: AsyncSession = Depends(get_async_session)):
    resultat_contact  = await db.execute(select(Contact).where(Contact.id_contact == admin.id_contact))
    contact = resultat_contact.scalar_one_or_none()
    if contact:
        result_tel = await db.execute(
            select(Telephone).where(Telephone.id_contact == contact.id_contact)
        )
        telephones = [
            {
                "id_telephone": t.id_telephone,
                "numero": t.numero,
                "type": t.type
            }
            for t in result_tel.scalars().all()
        ]

    return {
        "email": admin.email,
        "is_super_admin": admin.is_super_admin,
        "is_active": admin.is_active,
        "nom": admin.nom,
        "prenom": admin.prenom,
        "possition": admin.possition,

        "contact": {
            "id_contact": contact.id_contact if contact else None,
            "facebook": contact.facebook if contact else None,
            "adresse_postale": contact.adresse_postale if contact else None,
            "instagram": contact.instagram if contact else None,
            "email": contact.email if contact else None,
            "id_client": getattr(contact, "id_client", None),
            "telephones": telephones
        }
    }




# =======================Client===============================

app.include_router(client_routes.router)

# =======================Commande===============================
app.include_router(commande_routes.router)
