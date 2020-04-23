import express from 'express';
import bodyParser from 'body-parser';
import connectDB from '../config/db';
import { check, validationResult } from 'express-validator';
import Article from '../models/Article';
import path from 'path';

connectDB();

const app = express();
app.use(express.static(path.join(__dirname, '/build')));

const PORT = 8000;

app.use(bodyParser.json());

// @route    GET /api/articles/all
// @desc     Get articles
// @access   Public
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    if (articles) {
      return res.status(200).send(articles);
    }
    res.status(404).json({ msg: 'no articles in db' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error', error });
  }
});

// @route    GET /api/articles/:name
// @desc     Get article
// @access   Public
app.get('/api/articles/:name', async (req, res) => {
  try {
    const article = await Article.findOne({ name: req.params.name });
    if (article) {
      return res.status(200).send(article);
    }
    res.status(404).json({ msg: 'article not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error', error });
  }
});

// @route    POST /api/articles
// @desc     Create an article
// @access   public
app.post(
  '/api/articles/',
  [
    check('content', 'Text is required').not().isEmpty(),
    check('title', 'title is required').not().isEmpty(),
    check('username', 'username is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const article = new Article({
        ...req.body,
        name: req.body.title.replace(' ', '-'),
      });
      await article.save();
      return res.status(200).send(article);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'server error', error });
    }
  }
);

// @route    POST /api/articles/:name/upvote
// @desc     Upvote an article
// @access   public
app.post('/api/articles/:name/upvote', async (req, res) => {
  try {
    const article = await Article.findOne({
      name: req.params.name,
    });
    if (article) {
      article.upvotes++;
      await article.save();
      return res.status(200).send(article);
    }
    res.status(404).json({ msg: 'article not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error', error });
  }
});

// @route    POST /api/articles/:name/add-comment
// @desc     Comment an article
// @access   public
app.post(
  '/api/articles/:name/add-comment',
  [check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user, text } = req.body;
      const article = await Article.findOne({
        name: req.params.name,
      });
      if (article) {
        article.comments.unshift({ user, text });
        await article.save();
        return res.status(200).send(article);
      }
      res.status(404).json({ msg: 'article not found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'server error', error });
    }
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
