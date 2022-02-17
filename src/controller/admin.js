const db = require('../configuration/dbConnection')
// const { signupValidation, loginValidation } = require('../../validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotBeforeError } = require('jsonwebtoken');

async function register(req, res, next) {
    db.query(`SELECT * FROM admins WHERE LOWER(email) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if(err){
                return {status:false,error:err}
            }
            if (result.length) {
                return res.status(409).send({ msg: 'This user is already in use!' });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(req.body)
                        return res.status(500).send({ msg: err });
                    } else {
                        // has hashed pw => add to database
                        db.query(`INSERT INTO admin (nom, email, mot_de_passe) VALUES ('${req.body.name}', ${db.escape(req.body.email)}, ${db.escape(hash)})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                }
                                return res.status(201).send({ msg: 'The user has been registerd with us!' });
                            });
                    }
                });
            }
        });
};

async function login(req, res) {
    db.query(`SELECT * FROM admins WHERE email = ${db.escape(req.body.email)};`, (err, result) => {
        // user does not exists
        if (err) {
             return res.status(500).send( {status:500,error:err})
        }
        if (!result.length) {
             return res.status(401).send( {status:401,error: 'Email or password is incorrect 1 !'})
        }
        // check password
        bcrypt.compare(req.body.password, result[0]['mot_de_passe'], (bErr, bResult) => {
            // wrong password
            if (bErr) {
                return res.status(401).send( {status:401,error: 'Email or password is incorrect 1 !'})
            }
            if (bResult) {
                const token = jwt.sign({ id: result[0].id_admin }, 'the-super-strong-secrect', { expiresIn: '60h' });
                //db.query(`UPDATE admin SET last_login = now() WHERE id_admin = '${result[0].id}'`);
                return res.status(200).send( {status:200, msg: 'Logged in!', token:token, user: result[0] })
            }
            return res.status(403).send( {status:403, msg: 'Username or password is incorrect 3 !' })
        });
    });
};

async function getUser(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    console.log("token and id added")
    db.query('SELECT * FROM admins WHERE id_admin=?' ,decoded.id, function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        return res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
    });
};

async function getUserById(req, res) {

        var e_name,p_name,e_image,p_image,nb;
        db.query('SELECT p.nom,p.prenom,p.image,e.e_nom,e.e_prenom,e.e_image FROM parent p INNER JOIN etudiant e WHERE id_parent = id_fk_parent AND id_parent = ?', [req.params.id], (err, results) => {
            if(err) return err;
            nb = results.length;
            students = []
            results.forEach(element => {
                p_name = element['nom']+' '+element['prenom']
                p_image = element['image']
                e_name = element['e_nom']+' '+element['e_prenom']
                e_image = element['e_image']
                student = {'studentName': e_name,'studentImage': e_image}
                students.push(student)
            });
            json = { 'parentName': p_name, 'parentImage': p_image, 'nombre':nb, students:students};
            return json;
            
        })
}
module.exports.login = login
module.exports.register = register
module.exports.getUser = getUser