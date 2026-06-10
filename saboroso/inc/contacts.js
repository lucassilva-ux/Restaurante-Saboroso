var conn = require('./db');
let Pagination = require("./pagination");

module.exports = {

    render(req, res, error, success){

    res.render('contact', {
        title: 'Contato - Restaurante Saboroso!',
        background: 'images/img_bg_3.jpg',
        h1: 'Diga um oi!',
        body: req.body,
        error,
        success
    });

    }, 

    save(fields){

        return new Promise((resolve, reject)=>{

            conn.query(`
                    INSERT INTO tb_contacts (name, email, message)
                    VALUES(?, ?, ?)
                `, [
                    fields.name,
                    fields.email,
                    fields.message
                ], (err, results)=>{

                    if(err){

                        reject(err);
                    } else {

                        resolve(results);
                    }
                });
        });
    },

    getContacts(page) {

        if (!page) page = 1;

        let pag = new Pagination(
            `
                SELECT SQL_CALC_FOUND_ROWS * FROM tb_contacts ORDER BY name LIMIT ?, ?
            `,
            [],
            10
        );

        return pag.getPage(page).then(data => {

            return {
                data,
                currentPage: pag.getCurrentPage(),
                totalPages: pag.getTotalPages(),
                total: pag.getTotal()
            };

        });

    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `, [
                id
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });

        });

    }
};
