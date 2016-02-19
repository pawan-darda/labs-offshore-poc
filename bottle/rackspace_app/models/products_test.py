"""Test module for products."""
import unittest

from rackspace_app.models import products


# pylint: disable=too-many-public-methods
class TestProductsDetails(unittest.TestCase):
    """Test class for DbCacheMixin class."""

    def setUp(self):
        """Sets up the test environment."""
        pass

    def tearDown(self):
        """Tears down the test environment set by setUp."""
        pass

    def test_properties(self):
        """Test for properties available in ProductDetails model."""
        product_details = products.ProductsDetails()
        available_keys = product_details.keys()
        expected_keys = ['product_id', 'product_name', 'product_type']
        self.assertEquals(expected_keys, available_keys)
