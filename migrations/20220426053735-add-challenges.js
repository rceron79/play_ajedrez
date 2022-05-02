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
  db.createTable('challenges', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id1: { type: 'int', notNull: true, foreignKey: {
      name: 'challenges_fk',
      table: 'users',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      mapping: 'id'
    }},
    user_id2: { type: 'int', notNull: true, foreignKey: {
      name: 'challenges_fk2',
      table: 'users',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      mapping: 'id'
    }},
    winner_name: { type: 'string'},
    challenge_date: { type: 'date', notNull: true},
    is_played: { type: 'boolean', notNull: true, defaultValue: false},
  }, callback);
  return null;
};

exports.down = function(db, callback) {
  db.dropTable('challenges', callback);
  db.dropTable('users', callback);

  return null;
};

exports._meta = {
  "version": 1
};
