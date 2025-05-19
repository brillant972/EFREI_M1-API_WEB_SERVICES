import PhotoModel from '../models/photo.mjs';
import AlbumModel from '../models/album.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.Photo = connect.model('Photo', PhotoModel);
    this.Album = connect.model('Album', AlbumModel);
    this.run();
  }

  getAllByAlbum() {
    this.app.get('/album/:idalbum/photos', async (req, res) => {
      try {
        const photos = await this.Photo.find({ album: req.params.idalbum });
        res.status(200).json(photos);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  getById() {
    this.app.get('/album/:idalbum/photo/:idphotos', async (req, res) => {
      try {
        const photo = await this.Photo.findOne({ _id: req.params.idphotos, album: req.params.idalbum });
        if (!photo) return res.status(404).json({ code: 404, message: 'Photo not found' });
        res.status(200).json(photo);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  create() {
    this.app.post('/album/:idalbum/photo', async (req, res) => {
      try {
        // Check album exists
        const album = await this.Album.findById(req.params.idalbum);
        if (!album) return res.status(404).json({ code: 404, message: 'Album not found' });

        const photo = new this.Photo({ ...req.body, album: req.params.idalbum });
        await photo.save();

        // Add photo to album
        album.photos.push(photo._id);
        await album.save();

        res.status(201).json(photo);
      } catch (err) {
        res.status(400).json({ code: 400, message: 'Bad request' });
      }
    });
  }

  update() {
    this.app.put('/album/:idalbum/photo/:idphotos', async (req, res) => {
      try {
        const photo = await this.Photo.findOneAndUpdate(
          { _id: req.params.idphotos, album: req.params.idalbum },
          req.body,
          { new: true }
        );
        if (!photo) return res.status(404).json({ code: 404, message: 'Photo not found' });
        res.status(200).json(photo);
      } catch (err) {
        res.status(400).json({ code: 400, message: 'Bad request' });
      }
    });
  }

  delete() {
    this.app.delete('/album/:idalbum/photo/:idphotos', async (req, res) => {
      try {
        const photo = await this.Photo.findOneAndDelete({ _id: req.params.idphotos, album: req.params.idalbum });
        if (!photo) return res.status(404).json({ code: 404, message: 'Photo not found' });

        // Remove photo from album
        await this.Album.findByIdAndUpdate(req.params.idalbum, { $pull: { photos: photo._id } });

        res.status(200).json(photo);
      } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  run() {
    this.getAllByAlbum();
    this.getById();
    this.create();
    this.update();
    this.delete();
  }
};

export default Photos;
