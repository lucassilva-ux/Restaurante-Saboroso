class HcodeGrid {

    constructor(configs) {

        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }, configs);

        this.initForms();
        this.initButtons();

    }

    initForms() {

        let formCreate = document.querySelector(this.options.formCreate);

        formCreate.save().then(json => {

            window.location.reload();

        }).catch(err => {

            console.log(err);

        });

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {

            window.location.reload();

        }).catch(err => {

            console.log(err);

        });

    }

    initButtons() {

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {

            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();

                let tr = this.getTr(e);

                if (!tr) {
                    return;
                }

                let data = JSON.parse(tr.dataset.row);

                for (let name in data) {

                    let inputName = this.getInputName(name);
                    let input = this.formUpdate.querySelector(`[name=${inputName}]`);

                    switch (inputName) {

                        case 'date':
                            if (input) input.value = moment(data[name]).format('YYYY-MM-DD');
                            break;

                        case 'time':
                            if (input) input.value = data[name];
                            break;

                        default:
                            if (input) input.value = data[name];

                    }

                }

                $('#modal-update').modal('show');

            });

        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

            btn.addEventListener('click', e => {

                let tr = this.getTr(e);

                if (!tr) {
                    return;
                }

                let data = JSON.parse(tr.dataset.row);

                if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(json => {

                        window.location.reload();

                    });

                }

            });

        });

    }

    getTr(e) {

        let path = e.path || (e.composedPath && e.composedPath());

        if (path && path.length) {

            return path.find(el => {

                return el.tagName && el.tagName.toUpperCase() === 'TR';

            });

        }

        return e.target.closest('tr');
    }

    getInputName(name) {

        switch (name) {

            case 'date_input':
                return 'date';

            case 'time_input':
                return 'time';

            default:
                return name;

        }
    }

}
