"""Test module for product_api module."""

import json
import unittest

from mock import MagicMock
from rackspace_app.endpoints.product_api import Product, Products
from rackspace_app.models import products


# pylint: disable=too-many-public-methods
# pylint: disable=too-many-instance-attributes
class TestProduct(unittest.TestCase):
    """Test class for Product class."""

    def setUp(self):
        """Sets up test environment."""
        self.org_products_cached_create = products.ProductsDetails.cached_create
        self.org_products_cached_get = products.ProductsDetails.cached_get
        self.org_products_cached_delete = products.ProductsDetails.cached_delete
        products.ProductsDetails.cached_create = MagicMock()
        products.ProductsDetails.cached_get = MagicMock()
        products.ProductsDetails.cached_delete = MagicMock()

        self.product = Product()
        self.product_id = "12345"
        self.product_name = "Cisco 5SA"
        self.product_type = "FIREWALL"
        self.value = {
                "product_id":self.product_id,
                "product_name":self.product_name,
                "product_type":self.product_type
        }
        self.request = type('self.request', (),
                {'json': self.value})

    def tearDown(self):
        """Tears down the test environment set up by setUp."""
        products.ProductsDetails.cached_create = self.org_products_cached_create
        products.ProductsDetails.cached_get = self.org_products_cached_get
        products.ProductsDetails.cached_delete = self.org_products_cached_delete

    def test_init(self):  #pylint: disable=no-self-use
        """Test for __init__ function."""
        # Nothing to test. Just to get __init__ cover.
        Product()

    def test_post(self):
        """Test for cached_create function."""
        products.ProductsDetails.cached_create.return_value = None
        self.product.post(product_id=self.product_id, request=self.request)
        products.ProductsDetails.cached_create.assert_called_once_with(
                product_id=self.product_id, product_name=self.product_name,
                product_type=self.product_type)

    def test_post_no_data(self):
        """Test for cached_create function."""
        self.request.json = {}
        result = self.product.post(
                product_id=self.product_id, request=self.request)
        self.assertFalse(result[0]['success'])
        self.assertEquals('No data to post.', result[0]['msg'])
        self.assertEquals(400, result[1])

    def test_post_exception(self):
        """Test for exception in post function."""
        products.ProductsDetails.cached_create.side_effect = Exception
        result = self.product.post(
                product_id=self.product_id, request=self.request)
        message = ('Error while saving product ID %s: %s' %
                   (self.product_id, ''))
        return_exception = {'success': False, 'msg': message}, 500
        self.assertEquals(result, return_exception)

    def test_get(self):
        """Test for cached_get function."""
        products.ProductsDetails.product_id = self.product_id
        products.ProductsDetails.product_name = self.product_name
        products.ProductsDetails.product_type = self.product_type
        product_details_obj = products.ProductsDetails()
        products.ProductsDetails.cached_get.return_value = product_details_obj
        result = self.product.get(product_id=self.product_id)
        self.assertTrue(result['success'])
        self.assertEquals(result['data'], self.value)
        products.ProductsDetails.cached_get.assert_called_once_with(
                product_id=self.product_id)

    def test_get_exception(self):
        """Test for exception in get function."""
        # Test for DoesNotExist exception.
        products.ProductsDetails.cached_get.side_effect = \
                products.ProductsDetails.DoesNotExist
        result = self.product.get(product_id=self.product_id)
        message = 'No data found with product ID %s.' % self.product_id
        return_exception = {'success': True, 'msg': message}
        self.assertEquals(result, return_exception)

        # Test for Exception.
        products.ProductsDetails.cached_get.side_effect = Exception
        result = self.product.get(product_id=self.product_id)
        message = ('Error while fetching product ID %s: %s' %
                   (self.product_id, ''))
        return_exception = {'success': False, 'msg': message}, 500
        self.assertEquals(result, return_exception)

    def test_delete(self):
        """Test for cached_delete function."""
        products.ProductsDetails.cached_delete.return_value = None
        api = Product()
        api.delete(product_id=self.product_id)
        products.ProductsDetails.cached_delete(product_id=self.product_id)

    def test_delete_exception(self):
        """Test for exception in delete function."""
        # Test for DoesNotExist exception.
        products.ProductsDetails.cached_delete.side_effect = \
            products.ProductsDetails.DoesNotExist
        result = self.product.delete(product_id=self.product_id)
        message = 'No data found with product ID %s.' % self.product_id
        return_exception = {'success': False, 'msg': message}, 500
        self.assertEquals(result, return_exception)

        # Test for exception.
        products.ProductsDetails.cached_delete.side_effect = Exception
        result = self.product.delete(product_id=self.product_id)
        message = ('Error while deleting product ID %s: %s' %
                   (self.product_id, ''))
        return_exception = {'success': False, 'msg': message}, 500
        self.assertEquals(result, return_exception)


# pylint: disable=too-many-public-methods
# pylint: disable=too-many-instance-attributes
class TestProducts(unittest.TestCase):
    """Test class for Products class."""

    def setUp(self):
        """Sets up test environment."""


    def tearDown(self):
        """Tears down the test environment set up by setUp."""


    def test_init(self):  #pylint: disable=no-self-use
        """Test for __init__ function."""
        # Nothing to test. Just to get __init__ cover.
        Product()

    def test_get(self):
        """Test for get all products function."""
        org_objects = products.ProductsDetails.objects
        products.ProductsDetails.objects = MockObjects()
        #data = Products().get()
        # self.assertTrue()  #pylint: disable=no-value-for-parameter
        #products.ProductsDetails.objects = org_objects

    def test_get_exception(self):
        """Test for get all products function."""
	pass
        #data = Products().get()



class MockObjects():
    """Mock class to create 'products.ProductsDetails.objects' object to avoid
        DB call"""

    def all(self):
        product1 = products.ProductsDetails(
                product_id='11', product_name='Test1', product_type='Test Type')
        product2 = products.ProductsDetails(
                product_id='22', product_name='Test2', product_type='Test Type')
        return [product1, product2]
