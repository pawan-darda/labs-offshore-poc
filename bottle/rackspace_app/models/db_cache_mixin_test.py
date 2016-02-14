"""Test module for db_cache_mixin."""
import pickle
import unittest

from mock import MagicMock
from rackspace_app.models import products
from rackspace_app.models import db_cache_mixin

# pylint: disable=too-many-public-methods
class TestDbCacheMixin(unittest.TestCase):
    """Test class for DbCacheMixin class."""

    def setUp(self):
        """Sets up the test environment."""
        self.org_redis_get = db_cache_mixin.REDIS_CLIENT.get
        self.org_redis_delete = db_cache_mixin.REDIS_CLIENT.delete
        self.org_models_get = products.ProductsDetails.get
        self.org_models_create = products.ProductsDetails.create
        db_cache_mixin.REDIS_CLIENT.get = MagicMock()
        db_cache_mixin.REDIS_CLIENT.delete = MagicMock()
        products.ProductsDetails.get = MagicMock()
        products.ProductsDetails.create = MagicMock()
        self.test_data = {
            'product_id': 1234,
            'product_name': 'Test Product',
            'data': 'Test data'
        }

    def tearDown(self):
        """Tears down the test environment set by setUp."""
        db_cache_mixin.REDIS_CLIENT.get = self.org_redis_get
        db_cache_mixin.REDIS_CLIENT.delete = self.org_redis_delete
        products.ProductsDetails.create = self.org_models_create
        products.ProductsDetails.get = self.org_models_get

    def test_init(self):  # pylint: disable=no-self-use
        """Test for __init__ function."""
        # Nothing to test. Just to get __init__ cover.
        db_cache_mixin.DbCacheMixin()

    def test_cached_get_from_db(self):
        """Test for cached_get function."""
        db_cache_mixin.REDIS_CLIENT.get.return_value = None
        products.ProductsDetails.get.return_value = self.test_data
        data = products.ProductsDetails.cached_get(product_id='1234')
        self.assertEquals(self.test_data, data)
        db_cache_mixin.REDIS_CLIENT.get.assert_calls_once_with(
                product_id='1234')
        products.ProductsDetails.get.assert_calls_once_with(product_id='1234')

    def test_cached_get_from_cache(self):
        """Test for cached_get function fetching from cache."""
        pickled_data = pickle.dumps(self.test_data)
        db_cache_mixin.REDIS_CLIENT.get.return_value = pickled_data
        data = products.ProductsDetails.cached_get(product_id='1234')
        self.assertEquals(self.test_data, data)
        db_cache_mixin.REDIS_CLIENT.get.assert_calls_once_with(
                product_id='1234')
        self.assertFalse(products.ProductsDetails.get.called)

    def test_cached_delete(self):  # pylint: disable=no-self-use
        """Test for cached_delete function."""
        product_details_obj = products.ProductsDetails()
        product_details_obj.delete = MagicMock()
        products.ProductsDetails.get.return_value = product_details_obj
        products.ProductsDetails.cached_delete(product_id='1234')
        db_cache_mixin.REDIS_CLIENT.delete.assert_calls_once_with(
                product_id='1234')
        products.ProductsDetails.get.assert_calls_once_with(product_id='1234')
        product_details_obj.delete.assert_calls_once()

    def test_cached_create(self):
        """Test for cached_create function."""
        products.ProductsDetails.cached_create(**self.test_data)
        products.ProductsDetails.create.assert_calls_once_with(**self.test_data)
        db_cache_mixin.REDIS_CLIENT.delete.assert_calls_once_with(
                product_id='1234')
