"use strict";

//const sockets = require('../controller/sockets')
var parentController = require('../controller/parent');

var scannedParents = [];
var parentsArea = [];
var studentArea = null;

module.exports.start = function _callee6(http) {
  var io;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('start sockets');
          io = require('socket.io')(http, {
            cors: {
              origin: '*'
            },
            pingInterval: 5000,
            pingTimeout: 5000
          }); // redis.redisServer()

          io.on('connection', function (socket) {
            // console.log('new connection',socket.id);
            socket.on('parentArea', function _callee(data) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      setSocketID('parent', {
                        area: data.area,
                        socket: socket.id
                      });
                      console.log('parentArea connection', {
                        area: data.area,
                        id: socket.id
                      });

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            socket.on('studentArea', function _callee2(data) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      setSocketID('student', {
                        area: data.area,
                        socket: socket.id
                      });
                      console.log('studentArea connection', {
                        area: data.area,
                        id: socket.id
                      });

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            }); //socket firstScan

            socket.on('firstScan', function _callee3(data) {
              var parentArea, studentArea, _response;

              return regeneratorRuntime.async(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      console.log('first');
                      parentArea = getSocketID('parent', data.area);
                      studentArea = getSocketID('student', data.area);

                      if (getParent(data)) {
                        _context3.next = 11;
                        break;
                      }

                      _context3.next = 6;
                      return regeneratorRuntime.awrap(parentController.firstScan(data));

                    case 6:
                      _response = _context3.sent;

                      if (_response.status == 200) {
                        addParent('parent', data);
                        io.to(studentArea.socket).emit('firstScan', _response);
                      }

                      io.to(parentArea.socket).emit('firstScan', _response);
                      _context3.next = 12;
                      break;

                    case 11:
                      io.to(parentArea.socket).emit('firstScan', {
                        status: 403,
                        error: 'User already scanned, Go to second scan'
                      });

                    case 12:
                    case "end":
                      return _context3.stop();
                  }
                }
              });
            }); //socket secondScan 

            socket.on('secondScan', function _callee4(data) {
              var parentArea, studentArea;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      console.log('second');
                      parentArea = getSocketID('parent', data.area);
                      studentArea = getSocketID('student', data.area);

                      if (!getParent(data)) {
                        _context4.next = 11;
                        break;
                      }

                      _context4.next = 6;
                      return regeneratorRuntime.awrap(parentController.secondScan(data));

                    case 6:
                      response = _context4.sent;

                      if (response.status == 200) {
                        removeParent(data);
                        io.to(studentArea.socket).emit('secondScan', response);
                      }

                      io.to(parentArea.socket).emit('secondScan', response);
                      _context4.next = 12;
                      break;

                    case 11:
                      io.to(parentArea.socket).emit('secondScan', {
                        status: 403,
                        error: 'Scan in first scanner first'
                      });

                    case 12:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            });
            socket.on("connect_error", function () {
              // low-level connection
              // connection is denied by the server in a middleware
              console.log('connect_error ...', socket.id); // must reconnect after a given delay.
            });
            socket.on("reconnect_attempt", function () {
              console.log('reconnection ...', socket.id); // ...
            }); // 

            socket.on("reconnect", function () {
              console.log('reconnected', socket.id); // ...
            }); // 

            socket.on("disconnect", function _callee5() {
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      removeSocketID(socket.id);

                    case 1:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            });
          });

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

function addParent(actor, data) {
  switch (actor) {
    case 'parent':
      {
        scannedParents.push(data);
        break;
      }
  }
}

function getParent(data) {
  var parent = scannedParents.filter(function (parent) {
    return parent.RFID == data.RFID;
  });

  if (parent.length > 0) {
    console.log('parent exist');
    return true;
  } else {
    console.log('parent not exist');
    return false;
  }
}

function removeParent(data) {
  var response = false;

  for (var i = 0; i < scannedParents.length; i++) {
    if (data.RFID == scannedParents[i].RFID) {
      scannedParents.splice(i, 1);
      response = true;
    }
  }

  return response;
} // 


function setSocketID(actor, data) {
  switch (actor) {
    case 'parent':
      {
        parentsArea.push({
          area: data.area,
          socket: data.socket
        });
        break;
      }

    case 'student':
      {
        studentArea = data;
        break;
      }
  }
}

function getSocketID(actor, idArea) {
  switch (actor) {
    case 'parent':
      {
        var area = parentsArea.filter(function (area) {
          return area.area == idArea;
        });

        if (area.length > 0) {
          return area[0];
        } else {
          return null;
        }

        break;
      }

    case 'student':
      {
        return studentArea;
        break;
      }
  }
}

function removeSocketID(socket) {
  for (var i = 0; i < parentsArea.length; i++) {
    if (socket == parentsArea[i].socket) {
      parentsArea.splice(i, 1);
      console.log('parent area removed');
      response = true;
    }
  }
}