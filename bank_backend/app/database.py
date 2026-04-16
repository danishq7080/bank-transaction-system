from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

db_url="postgresql://postgres:Dqumar7080%40@localhost:5432/Bank_Database"

engine=create_engine(db_url)
SessionLocal = sessionmaker(bind=engine)
Base=declarative_base()
