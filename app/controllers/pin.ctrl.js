const Pin = require('../models/pin');
const User = require('../models/user');
const utils = require('../utils');

// Get all pins
exports.getAllPins = (req, res, next) => {
  Pin.find()
  	.then((pins) => {
    	return res.status(200).json({ pins });
  	})
  	.catch((err) => {
  		console.log(`pin.ctrl.js > getAllPins: ${err}`);
  		return handleError(res, err);
  	});
};

// Get all pins for one user. params = userId
exports.getUserPins = (req, res, next) => {
  console.log(`pin.ctrl.js > getUserPins: ${req.params.userId}`);
  Pin.find({ userId: req.params.userId })
    .then((pins) => {
      return res.status(200).json({ pins });
    })
    .catch((err) => {
      console.log(`pin.ctrl.js > getUserPins: ${err}`);
      return handleError(res, err);
    });
};

// Get a single pin by id. params = pinId
exports.getPinById = (req, res, next) => {
  Pin.find({ _id: req.params.pinId })
    .then((pin) => {
      return res.status(200).json({ pin });
      })
    .catch(err => {
      console.log(`pin.ctrl.js > getPinById: ${err}`);
      return handleError(res, err);
    });
};

// add new pin. body: { title, url, userId, userName, userAvatarUrl }
exports.addPin = (req, res, next) => {
  const pin = req.body;
  console.log(pin);

    const newPin = new Pin({
      title: pin.title,
  		url: pin.url,
  		userId: pin.userId,
  		userName: pin.userName,
  		userAvatarUrl: pin.userAvatarUrl
    });
    console.log(newPin);

    newPin.save()
	    .then((pin) => {
	      console.log('new pin saved');
	      console.log(pin);
	      return res.status(200).json({
	          message: 'Pin saved successfully',
	          pin
	        });
	    })
	    .catch((err) => {
	      console.log(`pin.ctrl.js > addPin: ${err}`);
      return handleError(res, err);
	    });
}

// Deletes a pin from the DB
exports.removePin = (req, res, next) => {
  Pin.findOne({ _id: req.params.pinId })
    .then((pin) => {
      if (!pin) {
        return res.status(404).json({message: 'Pin not found.'});
      } else {
        // Only owner can delete
        if (pin.userId.toString() === req.user._id.toString()) {
          pin.remove((err) => {
            if (err) {
              return handleError(res, err);
            } else {
              return res.status(204).json({message: `${pin.title} was deleted.`});
            }
          });
        } else {
          return res.status(403).json({message: 'You do not have permission to delete this item.'});
        }
      }
  })
  .catch((err) => {
      console.log('pin.ctrl.js > 93');
      console.log(err);
      return handleError(res, err);
    });
}

// Update likes. params: userId (from token),
// pinId, action ('plusplus' or 'minusminus')
exports.updateLikes = (req, res, next) => {
  const { pinId } = req.params;
  const userId = req.token._id;
  const action = req.query.action;

  Pin.findOne({ _id: req.params.pinId })
  	.exec()
    .then((pin) => {

      // fail if user already liked this pin
      if (action === "plusplus" && pin.likes.indexOf(userId) > -1) {
        return res.end();
      }

      // fail if user tries to unlike a pin they didn't already like
      if (action === "minusminus" && pin.likes.indexOf(userId) === -1) {
        return res.end();
      }

      // fail if user tries to like their own post
      if (pin.userId === userId) {
        return res.end();
      }

      // add/remove userId from likes array depending on action
      if (action === 'plusplus' && pin.likes.indexOf(userId) === -1) {
        pin.likes.push(userId);
      } else if (action === 'minusminus' && pin.likes.indexOf(userId) > -1) {
        let userIdx = pin.likes.indexOf(userId);
        pin.likes.splice(userIdx, 1);
      }

      // save updated pin and return updated pin to client
      pin.save();
    	return res.status(200).json({ pin });
    })
    .catch((err) => {
      console.log(`pin.ctrl.js > updateLikes: ${err}`);
      return handleError(res, err);
    });
}

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

