class HcodeFileReader {

    constructor(inputEl, imgEl) {

        this.inputEl = document.querySelector(inputEl);
        this.imgEl = document.querySelector(imgEl);
        this.init();

    }

    init() {

        this.inputEl.addEventListener('change', e => {

            this.read();

        });

    }

    read() {

        let file = this.inputEl.files[0];

        if (file) {

            let reader = new FileReader();

            reader.onload = e => {

                this.imgEl.src = e.target.result;

            };

            reader.readAsDataURL(file);

        }

    }

}
