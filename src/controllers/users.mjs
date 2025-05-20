import validator from 'better-validator';
import UserModel from '../models/user.mjs';
import { generateToken, authenticateJWT } from '../middleware/auth.mjs';

const Users = class Users {
  constructor(app, connect) {
    this.app = app;
    this.UserModel = connect.model('User', UserModel);

    this.run();
  }

  deleteById() {
    this.app.delete('/user/:id', authenticateJWT, (req, res) => {
      try {
        this.UserModel.findByIdAndDelete(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showById() {
    this.app.get('/user/:id', authenticateJWT, (req, res) => {
      try {
        this.UserModel.findById(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  create() {
    this.app.post('/user/', (req, res) => {
      const v = validator(req.body);
      v.str('firstname');
      v.str('lastname');
      v.optional.str('avatar');
      v.optional.num('age');
      v.optional.str('city');
      if (!v.isValid()) {
        return res.status(400).json({ code: 400, message: 'Invalid input', errors: v.getErrors() });
      }
      try {
        const userModel = new this.UserModel(req.body);

        userModel.save().then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/create -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  login() {
    this.app.post('/login', (req, res) => {
      const v = validator(req.body);
      v.str('firstname');
      if (!v.isValid()) {
        return res.status(400).json({ code: 400, message: 'Invalid input', errors: v.getErrors() });
      }
      const { firstname } = req.body;
      this.UserModel.findOne({ firstname }).then((user) => {
        if (!user) return res.status(401).json({ code: 401, message: 'Invalid credentials' });
        const token = generateToken({ id: user.id, firstname: user.firstname });
        res.status(200).json({ token });
      }).catch(() => {
        res.status(500).json({ code: 500, message: 'Internal Server error' });
      });
    });
  }

  run() {
    this.create();
    this.showById();
    this.deleteById();
    this.login();
  }
};

export default Users;
