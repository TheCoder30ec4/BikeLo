import functools
import logging
import time
from typing import Any, Callable, TypeVar, cast

F = TypeVar("F", bound=Callable[..., Any])


def get_logger(name: str | None = None) -> logging.Logger:
    """
    Get a configured logger instance.

    Call this in modules where you need logging:

        from Backend.utils.logger import get_logger
        logger = get_logger(__name__)
    """

    logger_name = name or "backend"
    logger = logging.getLogger(logger_name)

    if not logging.getLogger().handlers:
        # Configure root logger only once
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        )

    logger.setLevel(logging.INFO)
    return logger


def log_call(
    logger: logging.Logger | None = None,
    *,
    log_args: bool = False,
    log_return: bool = False,
    log_execution_time: bool = True,
) -> Callable[[F], F]:
    """
    Decorator to log function calls.

    Usage:

        from Backend.utils.logger import get_logger, log_call

        logger = get_logger(__name__)

        @log_call(logger, log_args=True, log_return=True)
        def my_function(x, y):
            ...
    """

    def decorator(func: F) -> F:
        logger_to_use = logger or get_logger(func.__module__)

        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            start = time.perf_counter()

            if log_args:
                logger_to_use.info(
                    "Calling %s with args=%s kwargs=%s", func.__qualname__, args, kwargs
                )
            else:
                logger_to_use.info("Calling %s", func.__qualname__)

            try:
                result = func(*args, **kwargs)
            except Exception as exc:  # noqa: BLE001
                logger_to_use.exception("Error in %s: %s", func.__qualname__, exc)
                raise
            finally:
                if log_execution_time:
                    duration_ms = (time.perf_counter() - start) * 1000
                    logger_to_use.info(
                        "Finished %s in %.2f ms", func.__qualname__, duration_ms
                    )

            if log_return:
                logger_to_use.info("Return from %s -> %r", func.__qualname__, result)

            return result

        return cast(F, wrapper)

    return decorator

