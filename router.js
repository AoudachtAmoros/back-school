const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotBeforeError } = require('jsonwebtoken');


router.post('/register', signupValidation, (req, res, next) => {
    db.query(`SELECT * FROM admin WHERE LOWER(email) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({ msg: 'This user is already in use!' });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({ msg: err });
                    } else {
                        // has hashed pw => add to database
                        db.query(`INSERT INTO admin (nom, email, mot_de_passe) VALUES ('${req.body.name}', ${db.escape(req.body.email)}, ${db.escape(hash)})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({ msg: err });
                                }
                                return res.status(201).send({ msg: 'The user has been registerd with us!' });
                            });
                    }
                });
            }
        });
});

router.post('/login', loginValidation, (req, res, next) => {
    db.query(`SELECT * FROM admin WHERE email = ${db.escape(req.body.email)};`, (err, result) => {
        // user does not exists
        if (err) {
            throw err;
            return res.status(400).send({ msg: err });
        }
        if (!result.length) {
            return res.status(401).send({
                msg: 'Email or password is incorrect 1 !'
            });
        }
        // check password
        bcrypt.compare(req.body.password, result[0]['mot_de_passe'], (bErr, bResult) => {
            // wrong password
            if (bErr) {
                throw bErr;
                return res.status(401).send({ msg: 'Email or password is incorrect 2 !' });
            }
            if (bResult) {
                const token = jwt.sign({ id: result[0].id_admin }, 'the-super-strong-secrect', { expiresIn: '1h' });
                //db.query(`UPDATE admin SET last_login = now() WHERE id_admin = '${result[0].id}'`);
                return res.status(200).send({ msg: 'Logged in!', token, user: result[0] });
            }
            return res.status(401).send({ msg: 'Username or password is incorrect 3 !' });
        });
    });
});

router.post('/get-user', signupValidation, (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    db.query('SELECT * FROM admin WHERE id_admin=?' ,decoded.id, function (error, fields, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
    });
});

router.get('/:id',(req, res) => {
    
        var e_name,p_name,e_image,p_image,nb;
        db.query('SELECT p.nom,p.prenom,p.image,e.e_nom,e.e_prenom,e.e_image FROM parent p INNER JOIN etudiant e WHERE id_parent = id_fk_parent AND id_parent = ?', [req.params.id], (err, results) => {
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
            res.json(json);
            //res.send(rows)
            if (!err) {
                
                res.send(results)
            } else {
                console.log(err)
            }

            // if(err) throw err
            
        })
})
module.exports = router;