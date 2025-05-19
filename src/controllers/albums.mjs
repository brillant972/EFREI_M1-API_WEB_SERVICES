import AlbumModel from '../models/album.mjs';
import PhotoModel from '../models/photo.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.Album = connect.model('Album', AlbumModel);
    this.Photo = connect.model('Photo', PhotoModel);
    this.run();
  }

  getById() {
    this.app.get('/album/:id', async (req, res) => {
      try {
        const album = await this.Album.findById(req.params.id).populate('photos');
        if (!album) return res.status(404).json({ code: 404, message: 'Album not found' });
        res.status(200).json(album);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  create() {
    this.app.post('/album', async (req, res) => {
      try {
        const album = new this.Album(req.body);
        await album.save();
        res.status(201).json(album);
      } catch (err) {
        res.status(400).json({ code: 400, message: 'Bad request' });
      }
    });
  }

  update() {
    this.app.put('/album/:id', async (req, res) => {
      try {
        const album = await this.Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!album) return res.status(404).json({ code: 404, message: 'Album not found' });
        res.status(200).json(album);
      } catch (err) {
        res.status(400).json({ code: 400, message: 'Bad request' });
      }
    });
  }

  delete() {
    this.app.delete('/album/:id', async (req, res) => {
      try {
        const album = await this.Album.findByIdAndDelete(req.params.id);
        if (!album) return res.status(404).json({ code: 404, message: 'Album not found' });
        // Optionally, delete all photos in this album
        await this.Photo.deleteMany({ album: album._id });
        res.status(200).json(album);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  getAll() {
    this.app.get('/albums', async (req, res) => {
      try {
        const filter = req.query.title ? { title: new RegExp(req.query.title, 'i') } : {};
        const albums = await this.Album.find(filter).populate('photos');
        res.status(200).json(albums);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  run() {
    this.getById();
    this.create();
    this.update();
    this.delete();
    this.getAll();
  }
};

export default Albums;
