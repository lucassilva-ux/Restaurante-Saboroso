let fs = require('fs');
let path = require('path');
let conn = require('./db');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function normalizeValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

function getUploadedPhotoPath(photoFile) {
    if (!photoFile || !photoFile.originalFilename) {
        return null;
    }

    return `images/${path.parse(photoFile.filepath).base}`;
}

function resolvePhotoPath(photo) {
    if (!photo) {
        return null;
    }

    const filename = path.basename(photo);
    const absolutePath = path.join(IMAGES_DIR, filename);

    if (path.dirname(absolutePath) !== IMAGES_DIR) {
        return null;
    }

    return absolutePath;
}

function unlinkFileIfExists(filePath) {
    if (!filePath) {
        return Promise.resolve();
    }

    return fs.promises.unlink(filePath).catch(err => {
        if (err.code === 'ENOENT') {
            return;
        }

        throw err;
    });
}

function deletePhotoIfUnused(photo, ignoreId) {
    const photoPath = resolvePhotoPath(photo);

    if (!photoPath) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

        const sql = ignoreId
            ? `
                SELECT COUNT(*) AS total
                  FROM tb_menus
                 WHERE photo = ?
                   AND id <> ?
                `
            : `
                SELECT COUNT(*) AS total
                  FROM tb_menus
                 WHERE photo = ?
                `;

        const params = ignoreId ? [photo, ignoreId] : [photo];

        conn.query(sql, params, async (err, results) => {

            if (err) {
                reject(err);
                return;
            }

            if (results[0].total > 0) {
                resolve();
                return;
            }

            try {
                await unlinkFileIfExists(photoPath);
                resolve();
            } catch (unlinkErr) {
                reject(unlinkErr);
            }
        });
    });
}

module.exports = {
    getMenus() {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT * FROM tb_menus ORDER BY title
                `, (err, results) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    },

    save(fields, files) {

        return new Promise((resolve, reject) => {

            const title = normalizeValue(fields.title);
            const description = normalizeValue(fields.description);
            const price = normalizeValue(fields.price);
            const photoFile = normalizeValue(files.photo);
            const photo = getUploadedPhotoPath(photoFile);

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
                    photo
                ], (err, results) => {

                    if (err) {
                        unlinkFileIfExists(resolvePhotoPath(photo))
                            .finally(() => reject(err));
                        return;
                    }

                    resolve(results);
                });
        });
    },

    update(fields, files) {

        return new Promise((resolve, reject) => {

            const id = normalizeValue(fields.id);
            const title = normalizeValue(fields.title);
            const description = normalizeValue(fields.description);
            const price = normalizeValue(fields.price);
            const currentPhoto = normalizeValue(fields.currentPhoto);
            const photoFile = files && files.photo ? normalizeValue(files.photo) : null;
            const uploadedPhoto = getUploadedPhotoPath(photoFile);
            const photo = uploadedPhoto || currentPhoto;

            if (!id) {
                reject(new Error('ID do menu nao informado.'));
                return;
            }

            if (!title) {
                reject(new Error('Titulo e obrigatorio.'));
                return;
            }

            if (!description) {
                reject(new Error('Descricao e obrigatoria.'));
                return;
            }

            if (!price) {
                reject(new Error('Preco e obrigatorio.'));
                return;
            }

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
                        unlinkFileIfExists(resolvePhotoPath(uploadedPhoto))
                            .finally(() => reject(err));
                        return;
                    }

                    if (!uploadedPhoto || uploadedPhoto === currentPhoto) {
                        resolve(results);
                        return;
                    }

                    deletePhotoIfUnused(currentPhoto, id)
                        .then(() => resolve(results))
                        .catch(reject);
                });
        });
    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT photo
                  FROM tb_menus
                 WHERE id = ?
                `, [id], (err, results) => {

                if (err) {
                    reject(err);
                    return;
                }

                if (!results.length) {
                    resolve({ affectedRows: 0 });
                    return;
                }

                const currentPhoto = results[0].photo;

                conn.query(`
                    DELETE FROM tb_menus
                     WHERE id = ?
                    `, [id], (deleteErr, deleteResults) => {

                    if (deleteErr) {
                        reject(deleteErr);
                        return;
                    }

                    deletePhotoIfUnused(currentPhoto)
                        .then(() => resolve(deleteResults))
                        .catch(reject);
                });
            });
        });
    }
};
