const express = require('express');
const cookieParser = require('cookie-parser');
const ssr = require('../middleware/ssr');

const config = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(ssr);
  app.use(cookieParser());
};

module.exports = config;
