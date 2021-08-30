const { query } = require('../database/database');
const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const historico = require('./historico');

function login(req, res) {
    var body = req.body;
    var user = body.user;
    var pass = body.pass;
    let query = `SELECT usuarios.*, roles.rol_name, rp.is_all, rp.is_edit, rp.is_create, rp.is_delete, rp.is_read FROM usuarios INNER JOIN roles_usuarios ON usuarios.id=roles_usuarios.user_id INNER JOIN roles ON roles_usuarios.rol_id=roles.id INNER JOIN roles_permisos AS rp ON roles.id=rp.rol_id WHERE usuarios.user="${user}"`;
    conexion.query(query, function(error, result, field) {
        if (error)
            return res.status(500).send({ message: 'error en el servidor', status: 500, err: error });
        if (result.length > 0) {
            let query2 = `UPDATE user_online SET estado='activo' WHERE user_id=${result[0].id}`;
            conexion.query(query2);
            if (bcrypt.compareSync(pass, result[0].password)) {
                historico.saveAccion(result[0].id, 'Se logueo ');
                return res.status(200).json({ message: 'usuario autenticado correctamente', status: 200, usuario: result });
            } else {
                return res.status(404).send({ message: 'no existe ningun usuario con ese user y pass', status: 400 });
            }
        } else {
            return res.status(404).send({ message: 'no existe ningun usuario con ese user y pass', status: 400 });
        }
    });
}

function userOnline(req, res) {
    let query = `SELECT * FROM user_online`;
    conexion.query(query, function(err, result, field) {
        if (err) {
            return res.status(500).send({ message: 'Ocurrio error interno del servidor por favor pruebe mas tarde' });
        }
        if (result) {
            // historico.saveAccion(result[0].user_id, 'Entro a la sesion de usuarios activos e inactivos');
            return res.status(200).send(result);
        }
    })
}

function logout(req, res) {
    var id = req.params.id;
    let query = `UPDATE user_online SET estado='inactivo' WHERE user_id=${id}`;
    conexion.query(query, function(err, result, field) {
        if (err) {
            return res.status(500).send({ message: 'Ocurrio error interno del servidor por favor pruebe mas tarde' });
        }
        if (result) {
            // console.log(result);
            historico.saveAccion(id, 'Se deslogueo de pagina');
            return res.status(200).send(result);
        }
    })
}

module.exports = {
    login,
    logout,
    userOnline,
};