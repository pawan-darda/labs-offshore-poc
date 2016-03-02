"""Module to define 'Product' related REST handlers."""
from flask import request
from flask.ext import restful  # pylint: disable=no-name-in-module
import json
from rackspace_app.models import products
from rackspace_app import LOGGER


# Error codes for different Server errors.
BAD_REQUEST = 400
INTERNAL_ERROR = 500
SUCCESS = 200

# Access control header.
ACCESS_CONTROL_HEADERS = {'Access-Control-Allow-Origin': '*'}


class ProductApiError(Exception):
    """Exception class to define errors for this module."""
    pass


class Product(restful.Resource):
    """Defines REST handlers for product APIs."""

    def __init__(self):
        pass

    def get(self, product_id):  #pylint: disable=no-self-use
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
            return ({'success': True, 'msg': message},
                    SUCCESS, ACCESS_CONTROL_HEADERS)
        except Exception as error:
            message = ('Error while fetching product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return ({'success': False, 'msg': message}, INTERNAL_ERROR,
                    ACCESS_CONTROL_HEADERS)
        return ({'success': True, 'data': data}, SUCCESS,
                ACCESS_CONTROL_HEADERS)

    def post(self, product_id, request=request):  #pylint: disable=no-self-use
        """Puts a product information in to DB with product ID as a key.

        Args:
            product_id: Unique ID of the product.

        Returns:
            A dictionary containing success message.
        """
        LOGGER.info('Received POST request for product ID: %s', product_id)
        data = json.loads(request.data)
        product_name = data.get('product_name', '')
        product_type = data.get('product_type', '')
        if not (product_name or product_type):
            # Return '400' with 'no data to save' message.
            return ({'success': False, 'msg': 'No data to post.'}, BAD_REQUEST,
                    ACCESS_CONTROL_HEADERS)
        try:
            products.ProductsDetails.cached_create(
                    product_id=product_id, product_name=product_name,
                    product_type=product_type)
        except Exception as error:  #pylint: disable=broad-except
            message = ('Error while saving product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return ({'success': False, 'msg': message}, INTERNAL_ERROR,
                    ACCESS_CONTROL_HEADERS)
        return ({'success': True, 'msg': 'Data posted successfully.'}, SUCCESS,
                ACCESS_CONTROL_HEADERS)

    def delete(self, product_id):  #pylint: disable=no-self-use
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
            return ({'success': False, 'msg': message}, INTERNAL_ERROR,
                    ACCESS_CONTROL_HEADERS)
        except Exception as error:  # pylint: disable=broad-except
            message = ('Error while deleting product ID %s: %s' %
                       (product_id, error.message))
            LOGGER.error(message)
            return ({'success': False, 'msg': message}, INTERNAL_ERROR,
                    ACCESS_CONTROL_HEADERS)
        return ({'success': True, 'msg': 'Data deleted successfully.'}, SUCCESS,
                ACCESS_CONTROL_HEADERS)

    def options(self, **kwargs):
        """Implements HTTP OPTIONS function to be used for access control."""
        return ({}, 200,
        {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods' : 'PUT,GET,DELETE,POST,OPTIONS',
            'Access-Control-Allow-Headers': ('Origin, X-Requested-With,'
                                             'Content-Type, Accept')
        })


class Products(restful.Resource):
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
        except Exception as error:
            message = ('Error while fetching products list, %s' % error.message)
            LOGGER.error(message)
            return ({'success': False, 'msg': message}, INTERNAL_ERROR,
                    ACCESS_CONTROL_HEADERS)
        return ({'success': True, 'products': products_list},
                SUCCESS, ACCESS_CONTROL_HEADERS)
