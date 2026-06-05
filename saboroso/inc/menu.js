let conn = require('./db');
let path = require('path');

module.exports = {
    getMenus(){

        return new Promise((resolve, reject)=> {

            conn.query( `
                SELECT * FROM tb_menus ORDER BY title
                `, (err, results)=>{

                if(err){

                    reject(err);
                }

                resolve(results);
            });
        });
    },

    save(fields, files){
        
        return new Promise((resolve, reject)=>{

            const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
            const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
            const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
            const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;

            if (!photoFile || !photoFile.originalFilename) {
                reject(new Error('Envie uma foto para salvar o menu.'));
                return;
            }

            conn.query(`
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES(?, ?, ?, ?) 
                `, [
                    title,
                    description,
                    price,
                    `images/${path.parse(photoFile.filepath).base}`
                ], (err, results) => {

                    if (err) {
                        reject(err);
                    } else {

                        resolve(results);
                    }
                });
        });
    },

    update(fields, files){

        return new Promise((resolve, reject) => {

            const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
            const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
            const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
            const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
            const currentPhoto = Array.isArray(fields.currentPhoto) ? fields.currentPhoto[0] : fields.currentPhoto;
            const photoFile = files && files.photo ? (Array.isArray(files.photo) ? files.photo[0] : files.photo) : null;

            if (!id) {
                reject(new Error('ID do menu não informado.'));
                return;
            }

            if (!title) {
                reject(new Error('Título é obrigatório.'));
                return;
            }

            if (!description) {
                reject(new Error('Descrição é obrigatória.'));
                return;
            }

            if (!price) {
                reject(new Error('Preço é obrigatório.'));
                return;
            }

            const photo = photoFile && photoFile.originalFilename
                ? `images/${path.parse(photoFile.filepath).base}`
                : currentPhoto;

            conn.query(`
                UPDATE tb_menus
                   SET title = ?,
                       description = ?,
                       price = ?,
                       photo = ?
                 WHERE id = ?
                `, [
                    title,
                    description,
                    price,
                    photo,
                    id
                ], (err, results) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
        });
    },

    delete(id){

        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_menus
                 WHERE id = ?
                `, [id], (err, results) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
        });
    }
};
