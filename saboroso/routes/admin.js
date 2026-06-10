var express = require("express");
var users = require("./../inc/users");
var admin = require("./../inc/admin");
var menus = require("./../inc/menu")
var reservations = require("./../inc/reservations");
var router = express.Router();
var formidable = require('formidable');
var path = require('path');

router.use(function(req, res, next){

    if (['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect('/admin/login');
    } else {

        return next();
    }
});

router.use(function(req, res, next){

    req.menus = admin.getMenus(req);

    return next();
});

router.get('/logout', function(req, res, next){

    delete req.session.user;

    res.redirect('/admin/login');
});

router.get('/', function (req, res, next){

    admin.dashboard().then(data => {

        res.render('admin/index', admin.getParams(req, {
            data
        }));

    }).catch(err=>{

        console.log(err);
    });
});

router.post('/login', function (req, res, next){

    var body = req.body || req.fields || {};

    if(!body.email){
        users.render(req,res, "Preencha o campo e-mail.");
    } else if (!body.password){
        users.render(req, res, "Preencha o campo senha.");
    } else {

        users.login(body.email, body.password).then(user => {

            req.session.user = user;
            res.redirect("/admin");

        }).catch(err => {

            users.render(req, res, err.message || err);
        });
    }
});

router.get('/login', function (req, res, next){

    users.render(req, res, null);
});

router.get('/contacts', function (req, res, next){

    res.render('admin/contacts', admin.getParams(req));
});

router.get('/emails', function (req, res, next){

    res.render('admin/emails', admin.getParams(req));
});

router.get('/menus', function (req, res, next){

    menus.getMenus().then(data => {

        res.render('admin/menus', admin.getParams(req, {
            data
        }));
    });
});

router.post('/menus', function(req, res, next){

    const fields = req.fields || {};
    const files = req.files || {};
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    if (!title) {
        return res.status(400).json({ error: 'Preencha o campo título.' });
    }

    if (!description) {
        return res.status(400).json({ error: 'Preencha o campo descrição.' });
    }

    if (!price) {
        return res.status(400).json({ error: 'Preencha o campo preço.' });
    }

    if (!photo || !photo.originalFilename) {
        return res.status(400).json({ error: 'Envie uma foto para salvar o menu.' });
    }

    menus.save(fields, files).then(results=>{

        res.json(results);
    }).catch(err=>{

        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.post('/menus/update', function(req, res, next){

    const fields = req.fields || req.body || {};
    const files = req.files || {};
    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const currentPhoto = Array.isArray(fields.currentPhoto) ? fields.currentPhoto[0] : fields.currentPhoto;
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    if (!id) {
        return res.status(400).json({ error: 'ID do menu não informado.' });
    }

    if (!title) {
        return res.status(400).json({ error: 'Preencha o campo título.' });
    }

    if (!description) {
        return res.status(400).json({ error: 'Preencha o campo descrição.' });
    }

    if (!price) {
        return res.status(400).json({ error: 'Preencha o campo preço.' });
    }

    if (!currentPhoto && (!photo || !photo.originalFilename)) {
        return res.status(400).json({ error: 'Envie uma foto para salvar o menu.' });
    }

    menus.update(fields, files).then(results => {
        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.post('/menus/delete', function(req, res, next){

    const body = req.body || req.fields || {};
    const id = Array.isArray(body.id) ? body.id[0] : body.id;

    if (!id) {
        return res.status(400).json({ error: 'ID do menu não informado.' });
    }

    menus.delete(id).then(results => {
        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.delete('/menus/:id', function(req, res, next) {

    menus.delete(req.params.id).then(results => {
        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.get('/reservations', function (req, res, next){

    reservations.getReservations(req.query).then(data => {

        res.render('admin/reservations', admin.getParams(req, {
            data,
            date: {
                start: req.query.start || '',
                end: req.query.end || ''
            }
        }));
    }).catch(next);
});

router.post('/reservations', function(req, res, next) {

    const body = req.body || req.fields || {};

    if (!body.name) {
        return res.status(400).json({ error: 'Preencha o campo nome.' });
    }

    if (!body.email) {
        return res.status(400).json({ error: 'Preencha o campo e-mail.' });
    }

    if (!body.people) {
        return res.status(400).json({ error: 'Preencha o campo pessoas.' });
    }

    if (!body.date) {
        return res.status(400).json({ error: 'Preencha o campo data.' });
    }

    if (!body.time) {
        return res.status(400).json({ error: 'Preencha o campo hora.' });
    }

    reservations.save(body).then(results => {
        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.post('/reservations/update', function(req, res, next) {

    const body = req.body || req.fields || {};

    if (!body.id) {
        return res.status(400).json({ error: 'ID da reserva nao informado.' });
    }

    if (!body.name) {
        return res.status(400).json({ error: 'Preencha o campo nome.' });
    }

    if (!body.email) {
        return res.status(400).json({ error: 'Preencha o campo e-mail.' });
    }

    if (!body.people) {
        return res.status(400).json({ error: 'Preencha o campo pessoas.' });
    }

    if (!body.date) {
        return res.status(400).json({ error: 'Preencha o campo data.' });
    }

    if (!body.time) {
        return res.status(400).json({ error: 'Preencha o campo hora.' });
    }

    reservations.update(body).then(results => {
        if (!results.affectedRows) {
            return res.status(404).json({
                error: 'Reserva nao encontrada.'
            });
        }

        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.post('/reservations/delete', function(req, res, next) {

    const body = req.body || req.fields || {};
    const id = Array.isArray(body.id) ? body.id[0] : body.id;

    if (!id) {
        return res.status(400).json({ error: 'ID da reserva nao informado.' });
    }

    reservations.delete(id).then(results => {
        if (!results.affectedRows) {
            return res.status(404).json({
                error: 'Reserva nao encontrada.'
            });
        }

        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.delete('/reservations/:id', function(req, res, next) {

    reservations.delete(req.params.id).then(results => {
        if (!results.affectedRows) {
            return res.status(404).json({
                error: 'Reserva nao encontrada.'
            });
        }

        res.json(results);
    }).catch(err => {
        res.status(500).json({
            error: err.message || String(err)
        });
    });
});

router.get('/users', function (req, res, next){

    res.render('admin/users', admin.getParams(req));
});

router.post('/users', function(req, res, next) {

    users.save(req.fields).then(results => {

        res.send(results);

    }).catch(err => {

        res.send(err);

    });

});

router.delete('/users/:id', function(req, res, next) {

    users.delete(req.params.id).then(results => {

        res.send(results);

    }).catch(err => {

        res.send(err);

    });

});

module.exports = router;
