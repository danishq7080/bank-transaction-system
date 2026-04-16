from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, SessionLocal
from . import model, schemas
from .auth import hash_password, verify_password
from .security import create_access_token, get_current_user


app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change later to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# USER REGISTRATION
# -------------------------
@app.post("/create-user")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    hashed = hash_password(user.password)

    new_user = model.User(
        name=user.name,
        email=user.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User Created Successfully"}


# -------------------------
# LOGIN
# -------------------------
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(model.User).filter(
        model.User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# -------------------------
# CREATE ACCOUNT
# -------------------------

import random

def generate_account_number():
    return str(random.randint(1000000000, 9999999999))

@app.post("/create-account")
def create_account(
    account: schemas.AccountCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Check existing accounts
    existing_accounts = db.query(model.Account).filter(
        model.Account.user_id == user_id
    ).all()

    if len(existing_accounts) >= 3:
        raise HTTPException(status_code=400, detail="Maximum 3 accounts allowed")

    # Prevent duplicate account types
    for acc in existing_accounts:
        if acc.account_type == account.account_type:
            raise HTTPException(status_code=400, detail="Account type already exists")

    account_number = generate_account_number()

    new_account = model.Account(
        user_id=user_id,
        account_number=account_number,
        account_type=account.account_type,
        balance=0
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return new_account


# -------------------------
# DEPOSIT
# -------------------------
@app.post("/deposit")
def deposit(
    data: schemas.DepositRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    account = db.query(model.Account).filter(
        model.Account.account_number == data.account_number,
        model.Account.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    account.balance += data.amount

    transaction = model.Transaction(
        account_id=account.id,
        transaction_type="deposit",
        amount=data.amount
    )

    db.add(transaction)
    db.commit()

    return {
        "message": "Deposit Successful",
        "balance": account.balance
    }


# -------------------------
# WITHDRAW
# -------------------------
@app.post("/withdraw")
def withdraw(
    data: schemas.WithdrawRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    account = db.query(model.Account).filter(
        model.Account.account_number == data.account_number,
        model.Account.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    account.balance -= data.amount

    transaction = model.Transaction(
        account_id=account.id,
        transaction_type="withdraw",
        amount=data.amount
    )

    db.add(transaction)
    db.commit()

    return {
        "message": "Withdrawal successful",
        "balance": account.balance
    }


# -------------------------
# TRANSFER
# -------------------------
@app.post("/transfer")
def transfer(
    data: schemas.TransferRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:
        sender = db.query(model.Account).filter(
            model.Account.account_number == data.sender_account,
            model.Account.user_id == user_id
        ).first()

        receiver = db.query(model.Account).filter(
            model.Account.account_number == data.receiver_account
        ).first()

        if not sender:
            raise HTTPException(status_code=404, detail="Sender account not found")

        if not receiver:
            raise HTTPException(status_code=404, detail="Receiver account not found")

        if sender.balance < data.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        sender.balance -= data.amount
        receiver.balance += data.amount

        sender_transaction = model.Transaction(
            account_id=sender.id,
            transaction_type="transfer_out",
            amount=data.amount
        )

        receiver_transaction = model.Transaction(
            account_id=receiver.id,
            transaction_type="transfer_in",
            amount=data.amount
        )

        db.add(sender_transaction)
        db.add(receiver_transaction)

        db.commit()

        return {"message": "Transfer successful"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# TRANSACTION HISTORY
# -------------------------
@app.get("/transactions/{account_number}")
def get_transactions(
    account_number: str,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    account = db.query(model.Account).filter(
        model.Account.account_number == account_number,
        model.Account.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    transactions = db.query(model.Transaction).filter(
        model.Transaction.account_id == account.id
    ).all()

    return transactions


# -------------------------
# CHECK BALANCE
# -------------------------
@app.get("/balance/{account_number}")
def check_balance(
    account_number: str,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    account = db.query(model.Account).filter(
        model.Account.account_number == account_number,
        model.Account.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return {
        "account_number": account.account_number,
        "balance": account.balance
    }

@app.get("/my-accounts")
def get_accounts(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):

    accounts = db.query(model.Account).filter(
        model.Account.user_id == user_id
    ).all()

    return accounts