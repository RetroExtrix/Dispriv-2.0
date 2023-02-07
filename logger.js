module.exports = {
  Log: function(text) {
    console.log('\x1b[36m%s\x1b[0m %s', '[Dispriv INFO]', text);
  },
  LogWarning: function(text) {
    console.log('\x1b[33m%s\x1b[0m %s', '[Dispriv WARN]', text);
  },
  LogError: function(text) {
    console.log('\x1b[31m%s\x1b[0m %s', '[Dispriv ERR]', text);
  },
  GenError: function(status, details, res) {
    res.status(status).json(
      {
        "message": details,
        "code": status
      }
    );
  },
  GenAccountErrorLogin: function(code, message, res) {
    res.status(400).json(
      {
        "message": "Invalid Form Body",
        "code": 50035,
        "errors": {
          "login": {
            "_errors": [
              {
                "code": code,
                "message": message
              }
            ]
          }
        }
      }
    );
  },
  GenAccountErrorRegister: function(code, message, res, errorType) {
    if (errorType == "username") {
      res.status(400).json(
        {
          "message": "Invalid Form Body",
          "code": 50035,
          "errors": {
            "username": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            }
          }
        }
      );
    }
    else if (errorType == "email") {
      res.status(400).json(
        {
          "message": "Invalid Form Body",
          "code": 50035,
          "errors": {
            "email": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            }
          }
        }
      );
    }
    if (errorType == "password") {
      res.status(400).json(
        {
          "message": "Invalid Form Body",
          "code": 50035,
          "errors": {
            "password": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            }
          }
        }
      );
    }
    else {
      res.status(400).json(
        {
          "message": "Invalid Form Body",
          "code": 50035,
          "errors": {
            "password": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            },
            "email": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            },
            "username": {
              "_errors": [
                {
                  "code": code,
                  "message": message
                }
              ]
            }
          }
        }
      );
    }
  }
}