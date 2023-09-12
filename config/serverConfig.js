const express = require('express');
const ssr = require('../middleware/ssr');

const config = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(ssr);
};

module.exports = config;
