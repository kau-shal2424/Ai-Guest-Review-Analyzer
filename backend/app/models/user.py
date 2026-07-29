from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ==========================
# User Signup Request
# ==========================
class UserCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirmPassword: str = Field(..., min_length=8, max_length=128)
    role: str = Field(..., description="Role of the user, must be either 'user' or 'admin'")

# ==========================
# User Login Request
# ==========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

# ==========================
# User Response (returned to client)
# ==========================
class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str
    role: str
    authProvider: str = "local"
    profileImage: Optional[str] = ""
    isActive: bool = True
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

# ==========================
# Token Response
# ==========================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ==========================
# Profile Update Request
# ==========================
class UserProfileUpdate(BaseModel):
    fullName: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=30)
    bio: Optional[str] = Field(None, max_length=500)

# ==========================
# Password Change Request
# ==========================
class PasswordChange(BaseModel):
    currentPassword: str = Field(..., min_length=1)
    newPassword: str = Field(..., min_length=8, max_length=128)
    confirmPassword: str = Field(..., min_length=8, max_length=128)

# ==========================
# Notification Settings
# ==========================
class NotificationSettings(BaseModel):
    criticalReviews: bool = True
    weeklyReport: bool = True
    aiSuggestions: bool = False
    platformUpdates: bool = False
    securityAlerts: bool = True
    marketing: bool = False

# ==========================
# Theme Settings
# ==========================
class ThemeSettings(BaseModel):
    theme: str = Field(..., description="light, dark, or system")
