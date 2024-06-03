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
                    availableQuantity: "",
                    ISBN: "",
                });
                const newLoanModel = new JSONModel({

                    borrowerName: "",
                    borrowerUserId: "",
                    borrowingBookName: "",
                    dueOn: ""
                    // user: {
                    //     userName: "",
                    //     userid: "",

                    // },
                    // takenbooks: {
                    //     title: "",
                    // },
                    // dueOn: ""
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
                // route to specific ui
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);

            },
            onCurrentUserDetails: function (oEvent) {
                const { userId } = oEvent.getParameter("arguments");
                this.ID = userId;
                const sRouterName = oEvent.getParameter("name");
                const oForm = this.getView().byId("idAdminDataPage");

                oForm.bindElement(`/UserLogin(${userId})`, {
                    expand: ''
                });
            },
            onLogoutPress: function () {
                const oRouter = this.getOwnerComponent().getRouter()
                MessageToast.show("Successfully Logged Out")
                oRouter.navTo("RouteloginView")

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

            onRefresh:function(){
                this.getView().byId("idBooksTable").getBinding("items").refresh()

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
                    var oavailableStock = oSelected.getBindingContext().getObject().availableQuantity
                    var oISBN = oSelected.getBindingContext().getObject().ISBN

                    const newBookModel = new JSONModel({
                        authorName: oAuthorName,
                        title: oBookname,
                        quantity: oStock,
                        availableQuantity: oavailableStock,
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
            onUpdateBook: function () {
                debugger
                var oPayload = this.getView().getModel("newBookModel").getData();
                var oTable = this.getView().byId("idBooksTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    MessageToast.show("Select a book to update");
                    return;
                }

                var oContext = oSelectedItem.getBindingContext();
                var oModel = oContext.getModel();

                // Update the properties directly on the context
                for (var prop in oPayload) {
                    if (oPayload.hasOwnProperty(prop)) {
                        oContext.setProperty(prop, oPayload[prop]);
                    }
                }

                // Submit the changes
                oModel.submitBatch("updateGroup").then(function () {
                    oTable.getBinding("items").refresh();
                    this.oCreateBookPop.close();
                    MessageToast.show("Book Updated Successfully");
                }.bind(this)).catch(function (oError) {
                    this.oCreateBookPop.close();
                    sap.m.MessageBox.error("Failed to update book: " + oError.message);
                }.bind(this));
            },
            onCreateBtnPress: async function () {
                debugger
                if (!this.oCreateBookPop) {
                    this.oCreateBookPop = await this.loadFragment("createBook")
                }
                this.oCreateBookPop.open()

            },

            onCreateBook: function () {
                debugger
                var oView = this.getView()
                var oModel = this.getView().getModel(),
                    oBinding = oModel.bindList("/Books")
                // var oContext = this.getView().byId("idBooksTable").getBinding("items")
                var oNewBook = this.getView().getModel("newBookModel").getData();
                oBinding.create(oNewBook, {
                    success: function () {
                        MessageToast.show("Book created successfully");

                    },
                    refresh: oView.byId("idBooksTable").getBinding("items").refresh(),
                    // setData:oView.getModel("newBookModel").setData(),
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                // oView.byId("idAuthorName").setValue(""),
                //     oView.byId("idbookNameInput").setValue(""),
                //     oView.byId("idStockInput").setValue(""),
                //     oView.byId("idavailableQuantityInput").setValue(""),
                //     oView.byId("idbooks_ISBNInput").setValue(""),
                this.oCreateBookPop.close()
                // this.getView().byId("idBooksTable").getBinding("items").refresh()

            },
            onCloseLoginDailog: function () {

                if (this.oCreateBookPop.isOpen()) {
                    this.oCreateBookPop.close()
                }

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
                    MessageToast.show("Please Select a Book to Delete");
                }
            },

            onActiveLoansClick: async function () {
                debugger
                if (!this.oActiveLoanPopUp) {
                    this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                    this.oNewLoanDailog = await this.loadFragment("loanCreate")
                    this.oReservationsDialog = await this.loadFragment("Reservations")

                }
                this.oActiveLoanPopUp.open();
                this.getView().byId("idLoanTable").getBinding("items").refresh();

            },
            onCloseActiveLoans: function () {
                // debugger;
                // this.byId("idActiveLoansTable").close();
                if (this.oActiveLoanPopUp.isOpen()) {
                    this.oActiveLoanPopUp.close();
                }

            },
            onReservationsClick: async function () {
                debugger
                if (!this.oReservationsDialog) {
                    this.oReservationsDialog = await this.loadFragment("Reservations")
                    // this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                    // this.oNewLoanDailog = await this.loadFragment("loanCreate")

                }
                this.getView().byId("idReservationsTable").getBinding("items").refresh();
                this.oReservationsDialog.open()

            },
            onReservationsClose: function () {
                if (this.oReservationsDialog.isOpen()) {
                    this.oReservationsDialog.close();
                }
            },
            onAddNewLoanPress: async function () {
                debugger
                if (!this.oNewLoanDailog) {
                    this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                    this.oNewLoanDailog = await this.loadFragment("loanCreate")
                    this.oReservationsDialog = await this.loadFragment("Reservations")
                }
                this.oNewLoanDailog.open()
            },
            onNewLoanDailogClose: function () {
                if (this.oNewLoanDailog.isOpen()) {
                    this.oNewLoanDailog.close();
                }
            },
            onSaveNewLoan: function () {
                try {
                    debugger;
                    var oModel = this.getView().getModel(),
                        oBindList = oModel.bindList("/Activeloans");
                    var oNewLoan = this.getView().getModel("newLoanModel").getData();
                    var sEnteredUserId = oNewLoan.borrowerUserId;
                    var sEnteredUserName = oNewLoan.borrowerName;
                    var sBookName = oNewLoan.borrowingBookName;


                    if (sEnteredUserId) {
                        var oModel = this.getView().getModel();
                        var oUserBinding = oModel.bindList("/UserLogin");

                        oUserBinding.filter([
                            new Filter("userid", FilterOperator.EQ, sEnteredUserId),
                            new Filter("userName", FilterOperator.EQ, sEnteredUserName),
                        ]);

                        oUserBinding.requestContexts().then(function (aUserContexts) {
                            debugger;
                            if (aUserContexts.length > 0) {
                                // Find the book based on book name
                                var oBookBinding = oModel.bindList("/Books");
                                oBookBinding.filter([
                                    new Filter("title", FilterOperator.EQ, sBookName)
                                ]);

                                oBookBinding.requestContexts().then(function (aBookContexts) {
                                    if (aBookContexts.length > 0) {
                                        var oBookContext = aBookContexts[0];
                                        var oBookData = oBookContext.getObject();

                                        oBindList.create(oNewLoan);

                                        // Update the book quantity
                                        oBookData.availableQuantity -= 1;
                                        oBookContext.setProperty("availableQuantity", oBookData.availableQuantity);

                                        oModel.submitBatch("updateGroup", {
                                            success: function () {
                                                MessageToast.show("Book Issued Successfully");
                                            },
                                            error: function (oError) {
                                                MessageToast.show("Error updating book quantity");
                                            }
                                        });

                                    } else {
                                        MessageToast.show("Book not found");
                                    }
                                });

                            } else {
                                MessageToast.show("User data not matching with existing records");
                            }
                        });

                        this.oNewLoanDailog.close();
                        this.oActiveLoanPopUp.close();
                    } else {
                        MessageToast.show("Enter correct user Data to Continue");
                    }
                } catch (error) {
                    MessageToast.show(error);
                }
            },
            onClearLoan: async function () {
                debugger
                if (!this.oDeleteCautionDailog) {
                    this.oDeleteCautionDailog = await this.loadFragment("confirmDelete")
                }
                this.oDeleteCautionDailog.open()
            },
            oDeleteCautionDailogClose: function () {
                if (this.oDeleteCautionDailog.isOpen()) {
                    this.oDeleteCautionDailog.close();
                }
            },
            onClearLoanButtonPress: function () {
                debugger;
                const oAdminView = this.getView(),
                    oSelected = oAdminView.byId("idLoanTable").getSelectedItem();

                if (oSelected) {
                    var oSelectedContext = oSelected.getBindingContext(),
                        oLoanData = oSelectedContext.getObject(),
                        sBookName = oLoanData.borrowingBookName, // Assume bookName is part of the loan data
                        oModel = this.getView().getModel(),
                        oUser = oLoanData.borrowerName;

                    // Delete the selected loan
                    oSelectedContext.delete("$auto").then(function () {
                        MessageToast.show(oUser + " Successfully Deleted");

                        // Increase the book quantity by one
                        var oBookBinding = oModel.bindList("/Books");
                        oBookBinding.filter([
                            new Filter("title", FilterOperator.EQ, sBookName)
                        ]);

                        oBookBinding.requestContexts().then(function (aBookContexts) {
                            if (aBookContexts.length > 0) {
                                var oBookContext = aBookContexts[0];
                                var oBookData = oBookContext.getObject();
                                var oQuan = oBookData.availableQuantity
                                var iQuan = parseInt(oQuan)
                                var ofinalQuan = iQuan + 1; 

                                oBookContext.setProperty("availableQuantity", ofinalQuan);
                                oModel.submitBatch("updateGroup", {
                                    success: function () {
                                        MessageToast.show("Book quantity updated successfully");
                                    },
                                    error: function (oError) {
                                        MessageToast.show("Error updating book quantity: " + oError.message);
                                    }
                                });
                            } else {
                                MessageToast.show("Book not found");
                            }
                        });
                    },
                        function (oError) {
                            MessageToast.show("Deletion Error: " + oError.message);
                        });

                    this.getView().byId("idLoanTable").getBinding("items").refresh();
                } else {
                    MessageToast.show("Please Select a user to close the loan");
                }

                this.oDeleteCautionDailog.close();
            }



            // onClearLoanButtonPress: function () {
            //     debugger
            //     const oAdminView = this.getView(),
            //         oSelected = oAdminView.byId("idLoanTable").getSelectedItem()
            //     if (oSelected) {
            //         var oUser = oSelected.getBindingContext().getObject().borrowerName
            //         oSelected.getBindingContext().delete("$auto").then(function () {
            //             MessageToast.show(oUser + " SuccessFully Deleted");
            //         },
            //             function (oError) {
            //                 MessageToast.show("Deletion Error: ", oError);
            //             });
            //         this.getView().byId("idLoanTable").getBinding("items").refresh();

            //     } else {
            //         MessageToast.show("Please Select a user to close the loan");
            //     }
            //     this.oDeleteCautionDailog.close()
            // }

        });
    });

