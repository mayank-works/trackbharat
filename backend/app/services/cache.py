# app/services/cache.py
#
# Tiny in-memory TTL cache. No Redis dependency — just a dict with
# expiration timestamps. Thread-safe via GIL (single dict op is atomic).
# Replace with Redis when you scale past one worker.

import time
from typing import Any, Optional


class _TTLCache:
    def __init__(self):
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        value, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: float):
        self._store[key] = (value, time.time() + ttl_seconds)

    def clear(self):
        self._store.clear()


cache = _TTLCache()