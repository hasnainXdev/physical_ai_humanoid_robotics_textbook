# Data Model: Authentication for Docusaurus

## User Entity
- **id**: string (UUID) - Unique identifier for the user
- **username**: string - Unique username for login
- **email**: string - User's email address (optional but recommended)
- **passwordHash**: string - Bcrypt hash of user's password (stored server-side)
- **createdAt**: Date - Account creation timestamp
- **lastLoginAt**: Date - Last login timestamp (optional)
- **isActive**: boolean - Whether the account is active
- **role**: string - User role (e.g., "user", "admin")

## Authentication Token
- **token**: string (JWT) - Authentication token
- **userId**: string - Reference to the user
- **expiresAt**: Date - Token expiration timestamp
- **type**: string - Token type (e.g., "access", "refresh")
- **createdAt**: Date - Token creation timestamp

## Password Reset Token
- **token**: string - Password reset token (one-time use)
- **userId**: string - Reference to the user
- **expiresAt**: Date - Token expiration timestamp
- **used**: boolean - Whether the token has been used

## Session State (Client-side)
- **userId**: string - Current user ID
- **username**: string - Current user's username
- **isLoggedIn**: boolean - Whether the user is currently logged in
- **accessToken**: string - Current access token
- **refreshToken**: string - Current refresh token (optional)
- **expiresAt**: Date - When the current session expires

## Relationships
- User has many Authentication Tokens (one-to-many)
- User has one Password Reset Token (one-to-one, temporary)
- Authentication Token belongs to one User (many-to-one)

## Validation Rules
- Username: Required, 3-30 characters, alphanumeric and underscores only
- Email: Optional, valid email format if provided
- Password: Required, minimum 8 characters, at least one uppercase, one lowercase, one number
- User must not exist with same username
- Password Reset Token must not be expired or already used
- Authentication Tokens must be verified against backend

## State Transitions
- User Registration: User created with isActive=true, role="user"
- User Login: Authentication Token created and returned to client
- Password Reset Initiated: Password Reset Token created, email sent
- Password Reset Completed: Password updated, Password Reset Token marked used
- User Logout: Client-side tokens cleared (server tokens may remain until expiration)