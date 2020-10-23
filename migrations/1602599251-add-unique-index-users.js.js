'use strict';

module.exports = {
  up: async (db) => {      
    return db.collection('users').createIndex( {'email': 1}, {unique: true, dropDups: true} );
  },

  down: async (db) => {
    return db.collection('users').dropIndex( {'email': 1}, {unique: true} );
  }
};
