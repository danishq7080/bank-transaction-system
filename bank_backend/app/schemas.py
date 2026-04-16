from pydantic import BaseModel,Field

class UserCreate(BaseModel):
    name: str
    email: str
    password: str=Field(..., max_length=72)

class AccountCreate(BaseModel):
    account_type: str

class UserLogin(BaseModel):
    email: str
    password: str

class DepositRequest(BaseModel):
    account_number: str
    amount: float


class WithdrawRequest(BaseModel):
    account_number: str
    amount: float

class TransactionCreate(BaseModel):
    account_id: int
    amount: float

class TransferRequest(BaseModel):
    sender_account: str
    receiver_account: str
    amount: float