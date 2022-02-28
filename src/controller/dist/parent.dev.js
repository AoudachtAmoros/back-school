"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require('../configuration/dbConnection');

var util = require('util');

var _require = require('os'),
    arch = _require.arch;

var query = util.promisify(db.query).bind(db); // All parents

function getParents(req, res, next) {
  var getParents;
  return regeneratorRuntime.async(function getParents$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          getParents = "SELECT * FROM parents";
          db.query(getParents, function _callee(error, result) {
            var i, etudiants;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!error) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return", res.status(404).json({
                      message: error.message,
                      error: 1
                    }));

                  case 4:
                    _context.prev = 4;
                    i = 0;

                  case 6:
                    if (!(i < result.length)) {
                      _context.next = 14;
                      break;
                    }

                    _context.next = 9;
                    return regeneratorRuntime.awrap(getStudents(result[i].id_parent));

                  case 9:
                    etudiants = _context.sent;
                    result[i].etudiants = etudiants;

                  case 11:
                    i++;
                    _context.next = 6;
                    break;

                  case 14:
                    return _context.abrupt("return", res.status(200).json({
                      data: result
                    }));

                  case 17:
                    _context.prev = 17;
                    _context.t0 = _context["catch"](4);
                    return _context.abrupt("return", res.status(404).json({
                      error: _context.t0
                    }));

                  case 20:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[4, 17]]);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
} // 
//Parents by ID


function getParent(req, res, next) {
  var getParent;
  return regeneratorRuntime.async(function getParent$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.body);
          getParent = "SELECT * FROM parents WHERE id_parent = ".concat(req.body.RFID);
          db.query(getParent, [req.params.parentID], function _callee2(error, result) {
            var i, students;
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!error) {
                      _context3.next = 4;
                      break;
                    }

                    return _context3.abrupt("return", res.status(404).json({
                      message: error.message,
                      error: 1
                    }));

                  case 4:
                    _context3.prev = 4;
                    i = 0;

                  case 6:
                    if (!(i < result.length)) {
                      _context3.next = 14;
                      break;
                    }

                    _context3.next = 9;
                    return regeneratorRuntime.awrap(getStudents(result[i].id_parent));

                  case 9:
                    students = _context3.sent;
                    result[i].students = students;

                  case 11:
                    i++;
                    _context3.next = 6;
                    break;

                  case 14:
                    return _context3.abrupt("return", res.status(200).json({
                      data: result
                    }));

                  case 17:
                    _context3.prev = 17;
                    _context3.t0 = _context3["catch"](4);
                    return _context3.abrupt("return", res.status(404).json({
                      error: _context3.t0
                    }));

                  case 20:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[4, 17]]);
          });

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
} //Parents by ID


function sGetParent(data) {
  var getParent, result, response, students;
  return regeneratorRuntime.async(function sGetParent$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          getParent = "SELECT * FROM parents WHERE id_parent = ".concat(data.RFID);
          _context5.next = 4;
          return regeneratorRuntime.awrap(query(getParent));

        case 4:
          result = _context5.sent;

          if (!(result.length > 0)) {
            _context5.next = 14;
            break;
          }

          response = result[0];
          _context5.next = 9;
          return regeneratorRuntime.awrap(getStudents(response.id_parent));

        case 9:
          students = _context5.sent;
          response.students = students;
          return _context5.abrupt("return", {
            status: 200,
            data: response
          });

        case 14:
          return _context5.abrupt("return", _defineProperty({
            status: 404,
            error: 'no such parent with this id'
          }, "error", 1));

        case 15:
          _context5.next = 21;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          return _context5.abrupt("return", _defineProperty({
            status: 500,
            error: _context5.t0
          }, "error", 1));

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 17]]);
} //Add parent


function addParent(req, res, next) {
  var checkParent = "SELECT id_parent FROM parent WHERE id_parent = ";
  db.query(checkParent, [req.body.id_parent], function (error, data) {
    console.log("TCL: addParent -> data", data);
    console.log("TCL: addParent -> checkParent", checkParent);

    if (error) {
      return res.status(404).json({
        error: error.message
      });
    } else {
      if (data.length > 0) {
        return res.status(404).json({
          message: 'Already exists'
        });
      } else {
        var data = [req.body.id_parent, req.body.nom, req.body.prenom, req.body.tel, req.body.adresse, req.body.cin, req.body.image];
        var insertParent = "INSERT INTO parents(id_parent, nom, prenom, tel, adresse, cin, image) values (?, ?, ?, ?, ?, ?, ?)";
        db.query(insertParent, data, function (error, result) {
          if (error) {
            return res.status(404).json({
              error: error.message
            });
          } else {
            return res.status(200).json(result);
          }
        });
      }
    }
  });
} //Delete parent


function deleteParent(req, res, next) {
  var deleteParent = "SELECT * FROM parents WHERE id_parent = ?";
  db.query(deleteParent, [req.params.parentID], function (error, result) {
    if (error) {
      return res.status(404).json({
        message: error.message
      });
    } else {
      if (result.length == 0) {
        return res.status(404).json({
          message: 'Parent does not exist'
        });
      } else {
        var sqlUpdate = "DELETE FROM parents WHERE id_parent = ?";
        db.query(sqlUpdate, [req.params.parentID], function (error, result) {
          if (error) {
            return res.status(404).json({
              error: error.message
            });
          } else {
            return res.status(200).json({
              message: 'parent succefully deleted'
            });
          }
        });
      }
    }
  });
}

function getStudents(id) {
  var rows;
  return regeneratorRuntime.async(function getStudents$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(query("SELECT * FROM students WHERE id_fk_parent =".concat(id)));

        case 3:
          rows = _context6.sent;
          return _context6.abrupt("return", rows);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          return _context6.abrupt("return", _context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
} //firstSCan


function firstScan(data) {
  var getParent, rowDataPacket, parent, updateState, updateQuery, students;
  return regeneratorRuntime.async(function firstScan$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          getParent = "SELECT * FROM parents WHERE id_parent = ".concat(data.RFID);
          _context7.next = 4;
          return regeneratorRuntime.awrap(query(getParent));

        case 4:
          rowDataPacket = _context7.sent;

          if (!(rowDataPacket.length > 0)) {
            _context7.next = 19;
            break;
          }

          parent = rowDataPacket[0];
          updateState = "UPDATE parents SET scan_state=\"first_scan\" WHERE  id_parent=".concat(parent.id_parent);
          _context7.next = 10;
          return regeneratorRuntime.awrap(query(updateState));

        case 10:
          updateQuery = _context7.sent;
          console.log("The state has been updated successfully");
          _context7.next = 14;
          return regeneratorRuntime.awrap(getStudents(parent.id_parent));

        case 14:
          students = _context7.sent;
          parent.students = students;
          return _context7.abrupt("return", {
            status: 200,
            data: parent
          });

        case 19:
          return _context7.abrupt("return", {
            status: 404,
            error: 'no such parent with this id'
          });

        case 20:
          _context7.next = 26;
          break;

        case 22:
          _context7.prev = 22;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          return _context7.abrupt("return", {
            status: 500,
            error: _context7.t0
          });

        case 26:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 22]]);
} //secondScan


function secondScan(data) {
  var getParent, rowDataPacket, parent, updateState, updateQuery;
  return regeneratorRuntime.async(function secondScan$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          getParent = "SELECT * FROM parents WHERE id_parent = ".concat(data.RFID);
          _context8.next = 4;
          return regeneratorRuntime.awrap(query(getParent));

        case 4:
          rowDataPacket = _context8.sent;

          if (!(rowDataPacket.length > 0)) {
            _context8.next = 15;
            break;
          }

          parent = rowDataPacket[0];
          updateState = "UPDATE parents SET scan_state=\"second_scan\" WHERE  id_parent=".concat(parent.id_parent);
          _context8.next = 10;
          return regeneratorRuntime.awrap(query(updateState));

        case 10:
          updateQuery = _context8.sent;
          console.log("The state has been updated successfully");
          return _context8.abrupt("return", {
            status: 200,
            data: parent
          });

        case 15:
          return _context8.abrupt("return", {
            status: 404,
            error: 'no such parent with this id'
          });

        case 16:
          _context8.next = 22;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          return _context8.abrupt("return", {
            status: 500,
            error: _context8.t0
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 18]]);
}

module.exports = {
  getParents: getParents,
  getParent: getParent,
  sGetParent: sGetParent,
  addParent: addParent,
  deleteParent: deleteParent,
  firstScan: firstScan,
  secondScan: secondScan
};