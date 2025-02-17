import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { AuthService } from "aurelia-authentication";
var moment = require("moment");

@inject(Router, Service,AuthService)
export class List {
    constructor(router, service,authService) {
        this.service = service;
        this.router = router;
        this.authService=authService;
    }
    filter={};
    
    activate(params) {
        let username = null;
        if (this.authService.authenticated) {
            const me = this.authService.getTokenPayload();
            username = me.username;
        }
        this.filter={
          CreatedBy: username
        }
      }

    context = ["Rincian"];

    columns = [
        { field: "SewingInNo", title: "No Sewing In" },
        { field: "Article", title: "No Artikel" },
        { field: "TotalQuantity", title: "Jumlah", sortable: false },
        { field: "TotalRemainingQuantity", title: "Sisa", sortable: false },
        { field: "RONo", title: "RO" },
        { field: "UnitCode", title: "Unit Sewing In"},
        { field: "SewingFrom", title: "Asal Sewing"},
        { field: "UnitFromCode", title: "Asal Unit"},
        {
            field: "SewingInDate", title: "Tgl Sewing In", formatter: function (value, data, index) {
              return moment(value).format("DD MMM YYYY")
            },
        },
        
        // { field: "Items", title: "Kode Barang", sortable: false },
        { field: "Products", title: "Kode Barang", sortable: false },
    ]

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
            filter:JSON.stringify(this.filter)
        }
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
          }
        return this.service.search(arg)
        .then(result => {
            this.totalQuantity=result.info.totalQty;
            var data = {};
            console.log(result.data);
            data.total = result.info.total;
            data.data = result.data;
            //Enhance Jason Aug 2021
             data.data.forEach(s => 
                {
                   var arrProductCode = s.Products.split(",");
                   var arrUniqueProductCode = arrProductCode.filter((value, index, array) => array.indexOf(value) === index);
                   console.log(arrUniqueProductCode);
                   var strProductCode = "<ul>";
                   for(var item of arrUniqueProductCode)
                   {
                    strProductCode += "<li>" + item + "</li>";
                   }
                   strProductCode += "</ul>";
                   console.log(strProductCode);
                   s.Products = strProductCode;
            //     s.UnitCode=s.Unit.Code;
            //     s.UnitFromCode=s.UnitFrom.Code;
            //     if(s.Items){
            //     s.Items.toString = function () {
            //         var str = "<ul>";
            //         var products = [];
            //         for (var item of s.Items) {
            //             products.push(item.Product.Code)
            //         }
            //         var Products = products.filter(distinct);
            //         for(var product of Products){
            //         str += `<li>${product}</li>`;
            //         }
            //         str += "</ul>";
            //         return str;
            //             }
            //     }
            //     else{
            //     s.Items = "-";
            //     }
             });

            return {
            total: result.info.total,
            data: result.data
            }
        });
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}