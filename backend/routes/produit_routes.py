from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.commande import Commande
from models.detailsCommande import DetailsCommande
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from pydantic import condecimal
from sqlalchemy import select
from models.produit import Produit
from models.facture import Facture

from typing import List
router = APIRouter()

@router.get("/produits/liste")
async def list_produits(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Produit).order_by(Produit.id_produit)
    )
    produits = result.scalars().all()
    return produits