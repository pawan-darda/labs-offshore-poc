"""Module to define test suite for the application test cases."""
import unittest

from rackspace_app.endpoints import product_api_test
from rackspace_app.models import db_cache_mixin_test
from rackspace_app.models import products_test


# Test suite.
DB_CACHE_MIXIN_SUITE = unittest.TestLoader().loadTestsFromTestCase(
        db_cache_mixin_test.TestDbCacheMixin)
PRODUCT_DETAILS_SUITE = unittest.TestLoader().loadTestsFromTestCase(
        products_test.TestProductsDetails)
PRODUCT_API_SUITE = unittest.TestLoader().loadTestsFromTestCase(
        product_api_test.TestProduct)
PRODUCTS_API_SUITE = unittest.TestLoader().loadTestsFromTestCase(
        product_api_test.TestProducts)

ALL_TESTS = unittest.TestSuite(
    [
        DB_CACHE_MIXIN_SUITE,
        PRODUCT_DETAILS_SUITE,
        PRODUCT_API_SUITE,
        PRODUCTS_API_SUITE
    ])

unittest.TextTestRunner(verbosity=2).run(ALL_TESTS)
