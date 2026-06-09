var conn = require('./db');

function normalizeDateValue(dateValue) {

    if (!dateValue) {
        return null;
    }

    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString().slice(0, 10);
    }

    const value = String(dateValue).trim();

    if (!value) {
        return null;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const parts = value.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const parsed = new Date(value);

    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }

    return null;
}

function formatDateToInput(dateValue) {

    return normalizeDateValue(dateValue) || '';
}

function formatDateToDisplay(dateValue) {

    const normalized = normalizeDateValue(dateValue);

    if (!normalized) {
        return '';
    }

    const parts = normalized.split('-');

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatTimeValue(timeValue) {

    if (!timeValue) {
        return '';
    }

    const value = String(timeValue).trim();
    const match = value.match(/^(\d{2}:\d{2})/);

    return match ? match[1] : value;
}

function normalizeFields(fields) {

    return {
        id: fields.id,
        name: fields.name,
        email: fields.email,
        people: fields.people,
        date: normalizeDateValue(fields.date),
        time: fields.time
    };
}

module.exports = {

    render(req, res, error, success){

        res.render('reservations', {
            title: ' Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });
    },

    save(fields){

        return new Promise ((resolve, reject)=>{

            const normalizedFields = normalizeFields(fields);

            if (!normalizedFields.date) {
                reject(new Error('Data da reserva invalida.'));
                return;
            }

            conn.query(`
            INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES(?, ?, ?, ?, ?)
            `, [
                normalizedFields.name,
                normalizedFields.email,
                normalizedFields.people,
                normalizedFields.date,
                normalizedFields.time
            ], (err, results)=>{

                if(err) {

                    reject(err);
                } else {

                    resolve(results);
                }
            });
        });
    },

    getReservations(filters = {}) {

        return new Promise((resolve, reject) => {

            const where = [];
            const params = [];
            const start = normalizeDateValue(filters.start);
            const end = normalizeDateValue(filters.end);

            if (start) {
                where.push('date >= ?');
                params.push(start);
            }

            if (end) {
                where.push('date <= ?');
                params.push(end);
            }

            const sql = `
                SELECT *
                  FROM tb_reservations
                 ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
                 ORDER BY date DESC, time DESC, id DESC
            `;

            conn.query(sql, params, (err, results) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(results.map(row => ({
                    ...row,
                    date_input: formatDateToInput(row.date),
                    date_display: formatDateToDisplay(row.date),
                    time_input: formatTimeValue(row.time),
                    time_display: formatTimeValue(row.time)
                })));
            });
        });
    },

    update(fields) {

        return new Promise((resolve, reject) => {

            const normalizedFields = normalizeFields(fields);

            if (!normalizedFields.id) {
                reject(new Error('ID da reserva nao informado.'));
                return;
            }

            if (!normalizedFields.date) {
                reject(new Error('Data da reserva invalida.'));
                return;
            }

            conn.query(`
                UPDATE tb_reservations
                   SET name = ?,
                       email = ?,
                       people = ?,
                       date = ?,
                       time = ?
                 WHERE id = ?
            `, [
                normalizedFields.name,
                normalizedFields.email,
                normalizedFields.people,
                normalizedFields.date,
                normalizedFields.time,
                normalizedFields.id
            ], (err, results) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_reservations
                 WHERE id = ?
            `, [id], (err, results) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    }
};
