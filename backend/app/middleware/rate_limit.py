import time
from fastapi import Request, HTTPException, status

# In-memory store to track request timestamps per client IP
# Structure: { client_ip: [timestamp1, timestamp2, ...] }
_login_attempts = {}

def check_login_rate_limit(request: Request):
    """
    Dependency to rate limit sensitive endpoints (like Login)
    to a maximum of 5 attempts per 15 minutes per client IP.
    """
    client_ip = request.client.host
    now = time.time()
    fifteen_minutes = 900  # 15 minutes in seconds

    # Retrieve and filter attempts for this IP within the last 15 minutes
    attempts = _login_attempts.get(client_ip, [])
    attempts = [t for t in attempts if now - t < fifteen_minutes]

    # Check if threshold is exceeded
    if len(attempts) >= 5:
        # Calculate retry after duration
        oldest_attempt = attempts[0]
        retry_after = int(fifteen_minutes - (now - oldest_attempt))
        
        minutes = retry_after // 60
        seconds = retry_after % 60
        
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Please try again in {minutes}m {seconds}s.",
            headers={"Retry-After": str(retry_after)}
        )

    # Record the new attempt
    attempts.append(now)
    _login_attempts[client_ip] = attempts
