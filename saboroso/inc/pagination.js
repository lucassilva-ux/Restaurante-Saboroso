let conn = require("./db");

class Pagination {

    constructor(
        query,
        params = [],
        itemsPerPage = 10
    ){

        this.query = query;
        this.params = params;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;

    }

    getPage(page){

        this.currentPage = page - 1;

        this.params.push(
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        );

        return new Promise((resolve, reject)=>{

            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results)=>{

                if (err) {
                    reject(err);
                } else {

                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itemsPerPage);
                    this.currentPage++;

                    resolve(this.data);

                }

            });

        });

    }

    getTotal(){
        return this.total;
    }

    getCurrentPage(){
        return this.currentPage;
    }

    getTotalPages(){
        return this.totalPages;
    }

}

module.exports = Pagination;
