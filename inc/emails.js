var conn = require("./db");
let Pagination = require("./pagination");

module.exports = {

    getEmails(page){

        if (!page) page = 1;

        let pag = new Pagination(
            `
                SELECT SQL_CALC_FOUND_ROWS * FROM tb_emails ORDER BY email LIMIT ?, ?
            `,
            [],
            10
        );

        return pag.getPage(page).then(data=>{

            return {
                data,
                currentPage: pag.getCurrentPage(),
                totalPages: pag.getTotalPages(),
                total: pag.getTotal()
            };

        });

    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [
                id
            ], (err, results)=>{

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });

        });

    },

    save(req) {

        return new Promise((resolve, reject) => {

            if (!req.fields.email) {
                reject("Preencha o e-mail.");
            } else {

                conn.query(`
                    INSERT INTO tb_emails (email) VALUES(?)
                `, [
                    req.fields.email
                ], (err, results) => {

                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(results);
                    }

                });

            }

        });

    }

};
