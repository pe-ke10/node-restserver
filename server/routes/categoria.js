const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
            });

        });

});

// ============================
// Mostrar una categoria por id
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ============================
// Actualizar una categoria por id
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaDescripcion = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, cambiaDescripcion, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }

            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// ============================
// Eliminar una categoria por id
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            res.json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }

            });
        }

        res.json({
            ok: true,
            message: 'La categoria se elimino correctamente'
        });

    });


});



module.exports = app;