const db = require('../configuration/dbConnection')
const util = require('util');
const { arch } = require('os');
const query = util.promisify(db.query).bind(db);

// All parents
async function getParents(req, res, next) {
    var getParents = "SELECT * FROM parents"
    db.query(getParents,  async(error, result) => {
        if (error) {
          return  res.status(404).json({
            message : error.message,
            error : 1
          })
        } else {
              try {
                for(let i=0;i<result.length;i++){
                  let etudiants =  await getStudents(result[i].id_parent)
                  result[i].etudiants = etudiants
                }
                return  res.status(200).json({
                  data : result
                })
              } catch (error) {
                return  res.status(404).json({
                  error : error,
                })
              }
          }
        })
  }
  // 
  //Parents by ID
  async function getParent(req, res, next) {
    console.log(req.body); 
    var getParent = `SELECT * FROM parents WHERE id_parent = ${req.body.RFID}`
    db.query(getParent, [req.params.parentID], async (error, result) => {
        if (error) {
          // console.log(error);
          return  res.status(404).json({
            message : error.message,
            error : 1
          })
        } else {
          try {
            for(let i=0;i<result.length;i++){
              let students =  await getStudents(result[i].id_parent)
              result[i].students = students
            }
            return  res.status(200).json({
              data : result
            })
          } catch (error) {
            return  res.status(404).json({
              error : error,
            })
          }
      }
    })
  }
  //Parents by ID
  async function sGetParent(data) {
    try {
        var getParent = `SELECT * FROM parents WHERE id_parent = ${data.RFID}`
        let result = await query(getParent)
        if (result.length>0) {
            let response = result[0]
            let students =  await getStudents(response.id_parent)
            response.students = students
            return  {
              status :200,
              data : response
            }
        }else{
            return  {
              status :404,
              error : 'no such parent with this id',
              error : 1
            }
          }
      } catch (error) {
        console.log(error);
        return   {
          status :500,
          error : error,
          error : 1
        }
      }
    // db.query(getParent, '', async (error, result) => {
    //     if (error) {
    //       console.log(error);
    //       return  {
    //         status :404,
    //         error : error,
    //         error : 1
    //       }
    //     } else {
        
    //     }
    // })
  }
  
//Add parent
  function addParent(req, res, next) {
      var checkParent = "SELECT id_parent FROM parent WHERE id_parent = "
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
                    message : 'Already exists'
                })
              } else {
                    var data = [req.body.id_parent, req.body.nom, req.body.prenom, req.body.tel, req.body.adresse, req.body.cin, req.body.image]
                    var insertParent = "INSERT INTO parents(id_parent, nom, prenom, tel, adresse, cin, image) values (?, ?, ?, ?, ?, ?, ?)"
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
 
  async function  getStudents(id) {
    console.log(id);
    try {
      const rows = await db.query(`SELECT * FROM students WHERE id_fk_parent =${id}`);
      return rows 
    } catch(error) {
      console.log(error);
      return error
    }
   }
   
//firstSCan
  async function firstScan(data) {
    try {
      var getParent = `SELECT * FROM parents WHERE id_parent = ${data.RFID}`
      let result = await query(getParent)
      if (result.length>0) {
        //updateState 
        var updateS= 'UPDATE parents SET scan_state="waiting"';
        db.query(updateS,  async(error, res) => {
          if (error) {
            console.log("State update error",error);
            return  {
              status :500,
              error : error
            }
          }
          else {
                console.log("The state has been updated successfully");
                let response = result[0]
                console.log('----------',response);
                let students =  await getStudents(response.id_parent)
                response.students = students
                
                return  {
                  status :200,
                  data : response
                }
          }
       })
       }
      else{
          return  {
            status :404,
            error : 'no such parent with this id',
          }
        }
    }
     catch (error) {
      console.log(error);
      return   {
        status :500,
        error : error,
      }
    }
    }

    //secondScan
async function secondScan(data) {
  try {
    var getParent = `SELECT * FROM parents WHERE id_parent = ${data.RFID}`
    let result = await query(getParent)
    if (result.length>0) {
      //updateState 
      var updateS = `UPDATE parents SET scan_state="went" where id_parent = ${data.RFID}`;
      db.query(updateS,  async(error, result) => {
        if (error) {
          console.log("State update error",error);
            return  {
              status :500,
              error : error
            }
        }
        else {
          console.log("The state has been updated successfully");
          let response = result[0]
          let students =  await getStudents(response.id_parent)
          response.students = students
          return  {
            status :200,
            data : response
          }
        }
      })
       
    }else{
        return  {
          status :404,
          error : 'no such parent with this id',
          error : 1
        }
      }
  }
   catch (error) {
    console.log(error);
    return   {
      status :500,
      error : error,
      error : 1
    }
  }
  }
  
  module.exports = {
      getParents : getParents,
      getParent : getParent,
      sGetParent : sGetParent,
      addParent : addParent,
      deleteParent : deleteParent,
      firstScan :  firstScan,
      secondScan:secondScan,
  }