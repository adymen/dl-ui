import { inject, bindable } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

var CategoryLoader = require('../../../loader/category-loader');
var DivisionLoader = require('../../../loader/division-loader');
var UnitLoader = require('../../../loader/unit-loader');

@inject(Router, Service)
export class List {
    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    tableOptions = {
        pagination: false,
        showColumns: false,
        search: false,
        showToggle: false,
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    titles = [
        "Lokal",
        "Lokal Valas",
        "Import"
    ];

    activeTitle = "Lokal";
    changeTitle(title) {
        this.isSearch = false;
        if (title !== this.activeTitle) {
            this.activeTitle = title;
            // // this.selectedItems.splice(0, this.selectedItems.length);
            // // this.documentData.splice(0, this.documentData.length);
            // this.documentTable.refresh();
        }

        this.documentTable.refresh();
    }

    bind() { }

    changeTable(title) {

    }

    search() {
        this.isSearch = true;
        this.documentTable.refresh();
    }

    reset() {
        console.log("reset");
        this.division = null;
        this.category = null;
        this.unit = null;
        this.dueDate = null;
        this.isSearch = false;
        this.documentTable.refresh();
    }

    exportExcel() {
        console.log("excel")
    }

    printPdf() {
        console.log("pdf")
    }

    columns = [
        { field: 'CategoryName', title: 'Kategori' },
        { field: 'CurrencyCode', title: 'Kurs' },
        { field: 'DebtTotal', title: 'Hutang' },
        { field: 'DispositionTotal', title: 'Disposisi' },
        { field: 'Total', title: 'Total' }
    ];

    get categoryLoader() {
        return CategoryLoader;
    }

    get divisionLoader() {
        return DivisionLoader;
    }

    get unitLoader() {
        return UnitLoader;
    }

    loader = (info) => {
        let order = {};

        let categoryId = 0;
        if (this.category && this.category._id)
            categoryId = this.category._id;

        let divisionId = 0;
        if (this.division && this.division.Id)
            divisionId = this.division.Id;

        let unitId = 0;
        if (this.unit && this.unit.Id)
            unitId = this.unit.Id;

        let date = this.dueDate ? moment(this.dueDate).format("YYYY-MM-DD") : "";

        let arg = {
            categoryId, divisionId, unitId, date
        };

        console.log(this.activeRole)
        console.log(arg);

        // return this.service.search(arg)
        //     .then(result => {
        //         console.log(result);
        //         return {
        //             total: result.info.total,
        //             data: result.data
        //         }
        //     });

        if (this.isSearch) {
            switch (this.activeTitle) {
                case "Lokal":
                    return this.service.searchLocal(arg)
                        .then(result => {
                            console.log(result);
                            return {
                                total: result.TotalData,
                                data: result.Data
                            }
                        });
                case "Lokal Valas":
                    return this.service.searchLocalForeignCurrency(arg)
                        .then(result => {
                            console.log(result);
                            return {
                                total: result.TotalData,
                                data: result.Data
                            }
                        });
                case "Import":
                    return this.service.searchImport(arg)
                        .then(result => {
                            console.log(result);
                            return {
                                total: result.TotalData,
                                data: result.Data
                            }
                        });
            }
            return {
                total: 0,
                data: []
            }
        } else {
            return {
                total: 0,
                data: []
            }
        }


    }

}