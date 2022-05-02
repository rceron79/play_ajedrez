'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', notNull: true},
    level: { type: 'string', notNull: true},
    username: { type: 'string', notNull: true, unique: true},
    password: { type: 'string', notNull: true, defaultValue: '12345'},
    type: { type: 'string', notNull: true},
  }, callback);
  return null;
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
  return null;
};

exports._meta = {
  "version": 1
};
