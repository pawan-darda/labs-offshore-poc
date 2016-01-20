"""Rackspace demo application."""

import os

from rackspace_app import APP, API, db, LOGGER
from rackspace_app.endpoints import product_api
from flask import render_template


# Add all available API URls and endpoints here.
API.add_resource(
        product_api.Product,
        '/rackspace/flask/api/v1.0/product/<string:product_id>')
API.add_resource(
        product_api.Products, '/rackspace/flask/api/v1.0/products')


@APP.route('/index')
def main():
    return render_template('index.html')

@APP.route('/static/<path:path>')
def static_server():
    return APP.send_static_file(os.path.join('static', path))


if __name__ == '__main__':
    LOGGER.info('Starting Server...')
    db.Database().run()  # Runs Cassandra database server.
    APP.run(host=APP.config['SERVER_IP'], threaded=True, debug=APP.config['DEBUG'])
