from sqlalchemy import Integer,String,Float,Column,DateTime,ForeignKey
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__="users"
    id = Column(Integer,primary_key=True,index=True)
    name=Column(String)
    email=Column(String,unique=True)
    password=Column(String)
    

class Account(Base):
    __tablename__="accounts"
    id = Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer)
    balance=Column(Float)
    account_number=Column(String)
    account_type = Column(String)

class Transaction(Base):
    __tablename__="transactions"

    id =Column(Integer,primary_key=True,index=True)
    account_id=Column(Integer, ForeignKey("accounts.id"))
    transaction_type=Column(String)
    amount=Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
