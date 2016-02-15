"""Implements DB cache mixin layer."""
from rackspace_app import LOGGER
from rackspace_app.models import REDIS_CLIENT
import pickle

class DbCacheMixin(object):
    """Defines DbCacheMixin Class.

    Optimizes retrieval of data by enabling use of Redis cache layer to store
    and retrieval.
    NOTE: This model can not be used with models implementing 'Composite Keys'.
    """

    def __init__(self):
        pass

    @classmethod
    def cached_get(cls, **kwargs):
        """Gets data from DB only if it is not found in cache.

        Use this function instead of 'Models.get()' to enforce first lookup from
        cache. Data will be retrieved from DB only if it is not available in
        cache and cache will be filled with data for future retrievals.

        Args:
            kwargs: Dictionary containing primary key name to value mapping.
                Only one primary key is supported here.

        Returns:
            Object stored with the given primary key.
        """
        key_name = kwargs.keys()[0]
        value = kwargs[key_name]
        data = REDIS_CLIENT.get(value)
        if not data:
            LOGGER.info('Fetching DB for product ID: %s.', value)
            data = cls.get(**kwargs)
            REDIS_CLIENT.set(value, pickle.dumps(data))
        else:
            data = pickle.loads(data)
        return data

    @classmethod
    def cached_create(cls, **kwargs):
        """Creates column in to DB and deletes key from cache.

        Use this function instead of 'Models.create()' to enforce clearing of
        cache for the same key.

        Args:
            kwargs: Dictionary containing column name to value mapping.
        """
        key_name = cls._primary_keys.keys()[0]
        value = kwargs[key_name]
        LOGGER.info('Inserting product with ID %s in to DB.', value)
        cls.create(**kwargs)
        REDIS_CLIENT.delete(value)

    @classmethod
    def cached_delete(cls, **kwargs):
        """Deletes a column DB and from cache.

        Use this function instead of 'Models.delete()' to enforce clearing of
        cache for the same key.

        Args:
            kwargs: Dictionary containing column name to value mapping.
        """
        key_name = cls._primary_keys.keys()[0]
        value = kwargs[key_name]
        data = cls.get(**kwargs)
        LOGGER.info('Deleting product with ID %s from DB.', value)
        data.delete()
        REDIS_CLIENT.delete(value)
