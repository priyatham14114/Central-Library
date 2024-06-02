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
                    availableQuantity:"",
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

            onUpdateBook: function () {
                debugger
                const oModel = this.getView().getModel().bindList("/Books")
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
                oModel.update(oNewBook, {
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
                        availableQuantity: "",
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
                var oView = this.getView()
                var oModel = this.getView().getModel(),
                    oBinding = oModel.bindList("/Books")
                // var oContext = this.getView().byId("idBooksTable").getBinding("items")
                var oNewBook = this.getView().getModel("newBookModel").getData();
                oBinding.create(oNewBook, {
                    success: function () {
                        MessageToast.show("Book created successfully");

                    },
                    refresh:oView.byId("idBooksTable").getBinding("items").refresh(),
                    // setData:oView.getModel("newBookModel").setData(),
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                oView.byId("idAuthorName").setValue(""),
                oView.byId("idbookNameInput").setValue(""),
                oView.byId("idStockInput").setValue(""),
                oView.byId("idavailableQuantityInput").setValue(""),
                oView.byId("idbooks_ISBNInput").setValue(""),
                this.oCreateBookPop.close()
                // this.getView().byId("idBooksTable").getBinding("items").refresh()

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
                // last change here.....
                try {
                    debugger
                    var oModel = this.getView().getModel(),
                        oBindList = oModel.bindList("/Activeloans")
                    var oNewLoan = this.getView().getModel("newLoanModel").getData()
                    var sEnteredUserId = oNewLoan.borrowerUserId
                    var sEnteredUserName = oNewLoan.borrowerName

                    if (sEnteredUserId) {
                        var oModel = this.getView().getModel();
                        var oBinding = oModel.bindList("/UserLogin");

                        oBinding.filter([
                            new Filter("userid", FilterOperator.EQ, sEnteredUserId),
                            new Filter("userName", FilterOperator.EQ, sEnteredUserName),

                        ]);

                        oBinding.requestContexts().then(function (aContexts) {  //requestContexts is called to get the contexts (matching records) from the backend.
                            debugger
                            if (aContexts.length > 0) {
                                oBindList.create(oNewLoan)
                                MessageToast.show("Book Issued Successfully");
                            } else {
                                MessageToast.show("User data not matching with existing records")
                            }
                        })
                        this.oNewLoanDailog.close()
                        this.oActiveLoanPopUp.close()
                    } else {
                        MessageToast.show("Enter correct user Data to Continue")
                    }
                } catch (error) {
                    MessageToast.show(error)
                }
                // this.getView().getModel("newLoanModel").setData("");
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
                debugger
                const oAdminView = this.getView(),
                    oSelected = oAdminView.byId("idLoanTable").getSelectedItem()
                if (oSelected) {
                    var oUser = oSelected.getBindingContext().getObject().borrowerName
                    oSelected.getBindingContext().delete("$auto").then(function () {
                        MessageToast.show(oUser + " SuccessFully Deleted");
                    },
                        function (oError) {
                            MessageToast.show("Deletion Error: ", oError);
                        });
                    this.getView().byId("idLoanTable").getBinding("items").refresh();

                } else {
                    MessageToast.show("Please Select a user to close the loan");
                }
                this.oDeleteCautionDailog.close()
            }

        });
    });

