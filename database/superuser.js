const bcrypt = require('bcrypt');
const conexion = require('./database');
const server_address = `http://localhost:3000/apis/`;

function createSuperUser(req, res) {
    const render = `<style type="text/css">
    input {
        padding-left: 10px;
        margin: 10px;
        border-radius: 5px;
        border: none;
        height: 40px;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
        transition: 500ms;
        outline: none;
    }

    input:hover {
        margin: 5px;
        outline: solid #f44336;
        transition: 500ms;
    }

    input:focus{
        border: none;
        outline: solid #f44336;
        /* border: solid rgb(212, 72, 29) 0.2em; */
    }

    button {
        background-color: #f44336;
        border: none;
        border-radius: 5px;
        height: 40px;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
        margin-bottom: 10px;
        margin-inline: 10px;
        color: white;
        cursor: pointer;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bolder;
        transition: 500ms;
    }

    button:hover {
        background-color: #f44400;
        margin-inline: 5px;
        transition: 500ms;
    }

    form {
        display: flex;
        flex-direction: column;
        margin-left: 35%;
        margin-right: 35%;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
        background: rgb(27 , 27, 27);
        padding: 30px;
        border-radius: 10px;
    }

    h4 {
        color: white;
        text-align: center;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }

    svg{
        border-radius: 50px;
        margin-inline: 36%;
        color: white;
        height: 100px;
        width: 100px;
        transition: 500ms;
    }

    svg:hover{
        margin-inline: 34%;
        color: #f44336;
        width: 120px;
        height: 120px;
        transition: 500ms;
    }
</style>

<body> 
    <form method="POST" action="${server_address}superuser">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
  </svg>
        <h4> Nuevo superuser</h4>
        <input id="user" name="user" type="text" placeholder="usuario" autocomplete="off" required>
        <input id="pass" name="pass" type="password" placeholder="password" autocomplete="off" required>
        <input id="confirm" name="confirm" type="password" placeholder="password" autocomplete="off" required>
        <button class="btn" id="btn" type="submit">Aceptar</button>
    </form>
</body>`;
    return res.status(200).send(render);
}

function saveSuperUsuario(req, res) {
    const user = req.body.user;
    const pass = req.body.pass;
    const confirm = req.body.confirm;
    var id = 0;
    var rol_id = 0;
    if (pass != confirm) return res.status(400).send(`<h4 style="text-align: center">Las contraseña no coinciden <a href="${server_address}superuser">Intentelo de nuevo</a></h4>`);
    bcrypt.hash(pass, 10, (err, encrypted) => {
        if (err) {
            console.log(err);
            return res.status(400).send(`<h4 style="text-align: center">Error intentelo de nuevo, ${err}</h4>`);
        } else {
            conexion.query(`INSERT INTO usuarios(id, user, password, full_name, register_date, register_hour,avatar) VALUES (NULL,"${user}","${encrypted}",NULL,NULL,NULL,NULL)`, function(error, results, fields) {
                if (error) return res.status(400).send(`<h4 style="text-align: center">Error intentelo de nuevo, ${error}</h4>`);
                if (results) {
                    id = results.insertId;
                    conexion.query(`INSERT INTO roles(id, rol_name, description) VALUES (NULL,"root","root")`, function(error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        if (results) {
                            rol_id = results.insertId;
                            var query_rol = `INSERT INTO roles_usuarios(id, user_id, rol_id) VALUES (NULL, ${id}, ${rol_id})`;
                            conexion.query(query_rol, function(error, results, fields) {
                                if (error)
                                    console.log(error);
                                if (results) {
                                    console.log("result", results);
                                } else {
                                    // console.log('asda');
                                }
                            });
                            var query = `INSERT INTO roles_permisos(id, rol_id, is_all, is_edit, is_create, is_delete, is_read) VALUES (NULL,${rol_id},1,1,1,1,1)`;
                            conexion.query(query, function(errors, results, fields) {
                                if (errors)
                                    console.log(errors);
                                if (results) {

                                } else {
                                    // return res.status(404).send({ message: 'no existe ningun rol con ese id' });
                                }
                            });
                        } else {
                            // return res.status(400).send({ message: 'Datos mal insertados' });
                        }
                    });

                    return res.status(200).send(`<h4 style="text-align: center">Superusuario creado satisfactoriamente !!</h4>`);
                }
            });
        }
    });
}



module.exports = {
    createSuperUser,
    saveSuperUsuario,
}