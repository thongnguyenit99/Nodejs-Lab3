const db = require('../utils/db');

const TABLE_USER = 'users'

module.exports = {
    selectAdmin: function (per) {
        return db.load(`select * from users`);
    },
    updataAdmin: function(entity){
        console.log(entity.attend);
        const condition = {
            f_Permission: entity.f_Permission
        }
        delete entity.attend;
        console.log(entity);
        
        return db.update(`update ${TABLE_USER} set ? where ?`,entity,condition);
    },
    insertUser: function(entity){
        return db.insert(`insert into  ${TABLE_USER} set ?`, entity);
    }
}