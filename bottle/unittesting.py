import unittest
from rackspace_app.endpoints import product_api_test

suite = unittest.TestLoader().loadTestsFromTestCase(product_api_test.TestProduct)
unittest.TextTestRunner(verbosity=2).run(suite)
