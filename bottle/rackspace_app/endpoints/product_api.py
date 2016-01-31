"""Module to define 'Product' related REST handlers."""

import os
import json
from bottle import request, static_file  # pylint: disable=redefined-outer-name

from rackspace_app.models import products
from rackspace_app import LOGGER


# Error codes for different Server errors.
INTERNAL_ERROR = 500
BAD_REQUEST = 400
STATIC_FILE_PATH = os.path.realpath('.')+'/rackspace_app/static/'
TEMPLATE_PATH = os.path.realpath('.')+'/rackspace_app/templates/'

class ProductApiError(Exception):
    """Exception class to define errors for this module."""
    pass


class Product(object):
    """Defines REST handlers for product APIs."""

    def __init__(self):
        pass

    def get(self, product_id):  # pylint: disable=no-self-use
        """Gets a product information by its product ID.

        Args:
            product_id: Unique ID of the product.

        Returns:
            A dictionary containing product info as JSON string.
        """
        LOGGER.info('Received GET request for product ID: %s', product_id)
        try:
            product = products.ProductsDetails.cached_get(product_id=product_id)
            data = {
                'product_name': product.product_name,
                'product_id': product.product_id,
                'product_type': product.product_type
            }
        except products.ProductsDetails.DoesNotExist:
            message = 'No data found with product ID %s.' % product_id
            LOGGER.error(message)
            # Return '200' with 'no data found' message.
            return {'success': True, 'msg': message}
        except Exception as error:
            message = ('Error while fetching product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return {'success': False, 'msg': message}, INTERNAL_ERROR
        return {'success': True, 'data': data}

    def post(self, product_id, request=request):  # pylint: disable=redefined-outer-name, no-self-use
        """Puts a product information in to DB with product ID as a key.

        Args:
            product_id: Unique ID of the product.

        Returns:
            A dictionary containing success message.
        """
        LOGGER.info('Received POST request for product ID: %s', product_id)
        #data = requerequest.formst.form.get('data', '{}')
        data = json.dumps(request.json)
        data = json.loads(data)
        product_name = data.get('product_name', '')
        product_type = data.get('product_type', '')
        if not (product_name or product_type):
            # Return '400' with 'no data to save' message.
            return {'success': False, 'msg': 'No data to post.'}, BAD_REQUEST
        try:
            #data_dict = json.loads(data)
            #product_name = data_dict.get('product_name', '')
            #product_type = data_dict.get('product_type', '')
            products.ProductsDetails.cached_create(
                    product_id=product_id, product_name=product_name,
                    product_type=product_type)
        except Exception as error:  #pylint: disable=broad-except
            message = ('Error while saving product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return {'success': False, 'msg': message}, INTERNAL_ERROR
        return {'success': True, 'msg': 'Data posted successfully.'}

    def delete(self, product_id):  # pylint: disable=no-self-use
        """Deletes a product information from DB.

        Args:
            product_id: Unique ID of the product.

        Returns:
            A dictionary containing success message.
        """
        LOGGER.info('Received DELETE request for product ID: %s', product_id)
        try:
            products.ProductsDetails.cached_delete(product_id=product_id)
        except products.ProductsDetails.DoesNotExist:
            message = 'No data found with product ID %s.' % product_id
            LOGGER.error(message)
            # Return '500' with 'no data found' message.
            return {'success': False, 'msg': message}, INTERNAL_ERROR
        except Exception as error:  # pylint: disable=broad-except
            message = ('Error while deleting product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return {'success': False, 'msg': message}, INTERNAL_ERROR
        return {'success': True, 'msg': 'Data deleted successfully.'}

    def static(self, filename):  # pylint: disable=no-self-use
        """Serves static files for the application

        Args:
            filename: Filename of the static files.

        Returns:
            Static files.
        """
        return static_file(filename, root=STATIC_FILE_PATH)

    def index(self):  # pylint: disable=no-self-use
        """Serves static files for the application

        Args:
            filename: Filename of the static files.

        Returns:
            index.html file.
        """
        return static_file('index.html', root=TEMPLATE_PATH)

class Products(object):  #pylint: disable=too-few-public-methods
    """Defines REST handlers for products APIs."""

    def __init__(self):
        pass

    def get(self):  # pylint: disable=no-self-use
        """Gets information about all available products.

        Returns:
            A dictionary containing products info as JSON string.
        """
        LOGGER.info('Received GET request for products list')
        try:
            query = products.ProductsDetails.objects.all()
            products_list = []
            for product in query:
                products_list.append({
                    'product_id': product.product_id,
                    'product_name': product.product_name,
                    'product_type': product.product_type
                })
        except Exception as error:  # pylint: disable=broad-except
            message = ('Error while fetching products list, %s' % error.message)
            LOGGER.error(message)
            return {'success': False, 'msg': message}, INTERNAL_ERROR
        return {'success': True, 'products': products_list}
