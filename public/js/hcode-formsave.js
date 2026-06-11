HTMLFormElement.prototype.save = function(config) {

    let form = this;

    config = Object.assign({
        success: () => {},
        failure: () => {}
    }, config);

    return new Promise((resolve, reject) => {

        form.addEventListener('submit', e => {
    
            e.preventDefault();

            let formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData
            })
            .then(response => response.json())
            .then(json => {

                if (json.error) {

                    config.failure(json);
                    reject(json);

                } else {

                    config.success(json);
                    resolve(json);

                }

            }).catch(err => {

                reject(err);

            });
        });
    });
}
