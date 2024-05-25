sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    // "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("com.app.centrallibrary.controller.adminView", {
            onInit: function () {
                MessageToast.show("Welcome to the Central Library");
                //  MultiInputs start
                const oAdminView = this.getView()
                const sAuthor = oAdminView.byId("idAuthorInputValue"),
                    sBookName = oAdminView.byId("idTitleInputValue")
                const oMultiInputs = [sAuthor, sBookName]

                oMultiInputs.forEach((inputs) => {
                    inputs.addValidator(function (args) {
                        if (true) {
                            var text = args.text;
                            return new Token({ key: text, text: text });
                        }
                    });

                });
                //  MultiInputs End
            },
            onFilterClick: function () {
                debugger
                const oAdminView = this.getView(),
                    sAuthor = oAdminView.byId("idAuthorInputValue").getTokens(),
                    sBookName = oAdminView.byId("idTitleInputValue").getTokens(),
                    oBooksTable = oAdminView.byId("idBooksTable"),
                    aFilters = [];

                // Last change here
                // sAuthor.filter((ele) => {
                //     ele ? aFilters.push(new Filter("authorName", FilterOperator.EQ, ele.getKey())) : "";
                // })
                // sBookName.filter((ele) => {
                //     ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
                // })

                var aInputsFields = [sAuthor, sBookName];
                aInputsFields.forEach((inputs) => {
                    if (inputs) {
                        inputs.filter((ele) => {
                            sAuthor.length > 0 ? aFilters.push(new Filter("authorName", FilterOperator.EQ, ele.getKey())) : "";
                            sBookName.length > 0 ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
                        })
                    }

                })
                oBooksTable.getBinding("items").filter(aFilters);
            },
            onClear: function () {
                const oAdminView = this.getView(),
                    sAuthor = oAdminView.byId("idAuthorInputValue").destroyTokens(),
                    sBookName = oAdminView.byId("idTitleInputValue").destroyTokens();
            },

            onDeleteBooks: function (oEvent) {
                // debugger;
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    var oBookName = oSelected.getBindingContext().getObject().title;

                    oSelected.getBindingContext().delete("$auto").then(function () {

                        MessageToast.show(oBookName + " SuccessFully Deleted");

                    },
                        function (oError) {
                            MessageToast.show("Deletion Error: ", oError);
                        });
                    this.getView().byId("idBooksTable").getBinding("items").refresh();

                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }
            },

            onActiveLoansClick: async function () {
                // debugger
                if (!this.oActiveLoanPopUp) {
                    this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                }
                this.oActiveLoanPopUp.open();
            },
            onCloseActiveLoans: function () {
                // debugger;
                // this.byId("idActiveLoansTable").close();
                if (this.oActiveLoanPopUp.isOpen()) {
                    this.oActiveLoanPopUp.close();
                }

            },


        });
    });

