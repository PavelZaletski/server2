const News = require('../models/news');

exports.getNews = function(req, res) {
  News.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
};

exports.getNewsWithId = function(req, res) {
  News.findOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });

};

exports.addNews = function(req, res) {
  const news = new News(req.body);
  if (req.user) {
    news.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('add news');
        res.status(201).send();
      } 
    });
  } else {
    console.log('Unauthorized');
    res.status(401).send();
  }
};

exports.deleteNews = function(req, res) {
  if (req.user) {
    News.deleteOne({ _id: req.params.id }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log('delete news');
        res.status(201).send();
      }
    });
  } else {
    console.log('Unauthorized');
    res.status(401).send();
  }
};

exports.updateNews = function(req, res) {
  if (req.user) {
    const param = {};
    for (key in req.body) {
      param[key] = req.body[key];
    }
    News.updateOne(
      { _id: req.params.id }, 
      param,
      (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('update news');
        res.status(201).send();
      }
    });
  } else {
    console.log('Unauthorized');
    res.status(401).send();
  }
};
