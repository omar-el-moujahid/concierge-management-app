from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker , declarative_base

DATABASE_URL="postgresql+asyncpg://neondb_owner:npg_aMJcm0rkojO1@ep-fancy-pond-aboz4wzr-pooler.eu-west-2.aws.neon.tech/Conciergerie?ssl=require&channel_binding=require"

# Base pour les models
Base = declarative_base()
# Création de l'engine asynchrone
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    future=True,
    poll_size=20,
    max_overflow=10,
    pool_timeout=10,
    )

# Création de la session asynchrone
AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession,
    expire_on_commit=False
)

# Fonction utilitaire pour obtenir une session
async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
# Fonction pour initialiser la base de données (créer les tables)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)