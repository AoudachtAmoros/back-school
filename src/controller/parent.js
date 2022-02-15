const db = require('../configuration/dbConnection')

// All parents
function getParents(req, res, next) {
    var getParents = "SELECT * FROM parents"
    db.query(getParents, (error, result) => {
        if (error) {
          return  res.status(404).json({
            message : error.message,
            error : 1
          })
        } else {
          return res.status(200).json({
            result : result
          })
        }
      }
    )
  }
  //Parents by ID
  function getParent(req, res, next) {
    var getParent = "SELECT * FROM parent WHERE id_parent = ?"
    db.query(getParent, [req.params.parentID], (error, result) => {
        if (error) {
          return  res.status(404).json({
            message : error.message,
            error : 1
          })
        } else {
            if (result.length == 0) {
                return res.status(404).json({
                    message : 'Parent does not exist'
                })
            } else {
                return res.status(200).json({
                    result : result
                })
            }
        }
      }
    )
  }
//Add parent
  function addParent(req, res, next) {
      var checkParent = "SELECT id_parent FROM parent WHERE id_parent = ?"
      db.query(checkParent, [req.body.id_parent], (error, data) => {
          console.log("TCL: addParent -> data", data)
          console.log("TCL: addParent -> checkParent", checkParent)
          if (error) {
            return res.status(404).json({
                error : error.message
            })
          } else {
              if (data.length > 0) {
                return res.status(404).json({
                    message : 'Parent already exists'
                })
              } else {
                    var data = [req.body.id_parent, req.body.nom, req.body.prenom, req.body.tel, req.body.adresse, req.body.cin, req.body.image]
                    var insertParent = "INSERT INTO parent(id_parent, nom, prenom, tel, adresse, cin, image) values (?, ?, ?, ?, ?, ?, ?)"
                    db.query(insertParent, data, (error, result) => {
                        if (error) {
                            return res.status(404).json({
                                error : error.message
                            })
                        } else {
                            return res.status(200).json(result)
                        }
                    })
              }
          }
      })
    
  }
//Delete parent
  function deleteParent(req, res, next) {
    var deleteParent = "SELECT * FROM parents WHERE id_parent = ?"
    db.query(deleteParent, [req.params.parentID], (error, result) => {
        if (error) {
          return  res.status(404).json({
            message : error.message,
          })
        } else {
            if (result.length == 0) {
                return res.status(404).json({
                    message : 'Parent does not exist'
                })
            } else {
                var sqlUpdate = "DELETE FROM parents WHERE id_parent = ?"
                db.query(sqlUpdate, [req.params.parentID], (error, result) => {
                    if (error) {
                        return res.status(404).json({
                            error : error.message
                        })
                    } else {
                        return res.status(200).json({
                            message : 'parent succefully deleted'
                        })
                    }
                })
            }
        }
      }
    )
  }

  module.exports = {
      getParents : getParents,
      getParent : getParent,
      addParent : addParent,
      deleteParent : deleteParent
  }