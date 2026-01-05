from pydantic import BaseModel, EmailStr

class LoginAdmin(BaseModel):
    email: str
    password: str
