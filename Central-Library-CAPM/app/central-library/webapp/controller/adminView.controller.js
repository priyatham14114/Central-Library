sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, Filter, FilterOperator, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("com.app.centrallibrary.controller.adminView", {
            onInit: function () {
                // welcome msg
                MessageToast.show("Welcome to the Central Library");

                const newBookModel = new JSONModel({
                    authorName: "",
                    title: "",
                    quantity: "",
                    ISBN: "",
                });
                const newLoanModel = new JSONModel({
                    Borrower_userid: "",
                    Borrower_Name: "",
                    BookName: "",
                    DueDate: ""
                });

                this.getView().setModel(newBookModel, "newBookModel");
                this.getView().setModel(newLoanModel, "newLoanModel");

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

            // onUpdateBook: function () {
            //     debugger
            //     let oSucess = function () {
            //         MessageToast.show("Changes Updated")
            //     }.bind(this)
            //     let oError = function (Error) {
            //         MessageBox.error(Error.message)
            //     }.bind(this)
            //     const oView = this.getView(),
            //         oAuthorName = oView.byId("idAuthorName").getValue(),
            //         oBookname = oView.byId("idbookNameInput").getValue(),
            //         oStock = oView.byId("idStockInput").getValue(),
            //         oISBN = oView.byId("idbooks_ISBNInput").getValue();
            //     const newBookModel = new JSONModel({
            //         authorName: oAuthorName,
            //         title: oBookname,
            //         quantity: oStock,
            //         ISBN: oISBN,
            //     });
            //     this.getView().setModel(newBookModel, "newBookModel");
            //     this.getView().getModel().submitBatch("booksGroup").then(oSucess, oError)
            //     this.getView().byId("idBooksTable").getBinding("items").refresh();
            //     this.oEditBooksPop.close()

            // },
            onUpdateBook: function () {
                debugger
                const oModel = this.getView().getModel()
                var oEditBook = this.getView().getModel("newBookModel").getData();
                // const oView = this.getView(),
                //     oAuthorName = oView.byId("idAuthorName").getValue(),
                //     oBookname = oView.byId("idbookNameInput").getValue(),
                //     oStock = oView.byId("idStockInput").getValue(),
                //     oISBN = oView.byId("idbooks_ISBNInput").getValue();
                // const newBookModel = new JSONModel({
                //     authorName: oAuthorName,
                //     title: oBookname,
                //     quantity: oStock,
                //     ISBN: oISBN,
                // });

                // var sPath = "/Books";
                // oModel.update(sPath, oEditBook, {
                //     success: function () {
                //         MessageToast.show("Book updated successfully");
                //     },
                //     error: function () {
                //         MessageToast.show("Error updating book");
                //     }
                // });
                var oContext = this.getView().byId("idBooksTable").getBinding("items")
                var oNewBook = this.getView().getModel("newBookModel").getData();
                oModel.update("Books", oNewBook, {
                    success: function () {
                        MessageToast.show("Book created successfully");
                    },
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                this.oEditBooksPop.close()

            },
            onCreateBtnPress: async function () {
                debugger
                if (!this.oCreateBookPop) {
                    this.oCreateBookPop = await this.loadFragment("createBook")
                }
                this.oCreateBookPop.open()

            },
            onCloseLoginDailog: function () {
                if (this.oCreateBookPop.isOpen()) {
                    const newBookModel = new JSONModel({
                        authorName: "",
                        title: "",
                        quantity: "",
                        ISBN: "",
                    });
                    this.getView().setModel(newBookModel, "newBookModel");
                    this.oCreateBookPop.close()
                }
            },
            onEditBook: async function () {
                debugger
                // if (!this.oEditBooksPop) {
                //     this.oEditBooksPop = await this.loadFragment("updateBook")
                // }
                debugger
                if (!this.oCreateBookPop) {
                    this.oCreateBookPop = await this.loadFragment("createBook")
                }

                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    // var oBook = oSelected.getBindingContext().getObject().ID;
                    var oAuthorName = oSelected.getBindingContext().getObject().authorName
                    var oBookname = oSelected.getBindingContext().getObject().title
                    var oStock = oSelected.getBindingContext().getObject().quantity
                    var oISBN = oSelected.getBindingContext().getObject().ISBN

                    const newBookModel = new JSONModel({
                        authorName: oAuthorName,
                        title: oBookname,
                        quantity: oStock,
                        ISBN: oISBN,
                    });
                    this.getView().setModel(newBookModel, "newBookModel");
                    // this.oEditBooksPop.open();
                    this.oCreateBookPop.open()

                }
                else {
                    MessageToast.show("Select an Item to Edit")
                }

            },
            // onCloseLoginDailog: function () {
            //     // if (this.oEditBooksPop.isOpen()) {
            //     //     this.oEditBooksPop.close()
            //     // }

            //     if (this.oCreateBookPop.isOpen()) {
            //         this.oCreateBookPop.close()
            //     }

            // },

            onCreateBook: function () {
                debugger
                // var oModel = this.getView().getModel(),
                //     oBinding = oModel.bindList("/Books")
                var oContext = this.getView().byId("idBooksTable").getBinding("items")
                var oNewBook = this.getView().getModel("newBookModel").getData();
                oContext.create(oNewBook, {
                    success: function () {
                        MessageToast.show("Book created successfully");
                    },
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                this.oCreateBookPop.close()

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
            onAddNewLoanPress: async function () {
                debugger
                if (!this.oNewLoanDailog) {
                    this.oNewLoanDailog = await this.loadFragment("loanCreate")
                }
                this.oNewLoanDailog.open()
            },
            onNewLoanDailogClose: function () {
                if (this.oNewLoanDailog.isOpen()) {
                    this.oNewLoanDailog.close();
                }
            },
            onSaveNewLoan: function () {
                var oContext = this.getView().byId("idLoanTable").getBinding("items")
                var oNewLoan = this.getView().getModel("newLoanModel").getData();
                oContext.create(oNewLoan, {
                    success: function () {
                        MessageToast.show("Book created successfully");
                    },
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                this.oNewLoanDailog.close()

            }

        });
    });

