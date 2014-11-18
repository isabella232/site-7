var mongo = require('mongojs');

var connection;

module.exports = function (config) {
	if (!connection) {
		connection = mongo.connect(config.connection, ['users', 'networks', 'items', 'subscribers', 'collections', 'pulse']);
		if (!connection) {
			throw new Error('could not connect to ' + config.connection);
		}
	}

	return connection;
};