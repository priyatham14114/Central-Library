
sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, Filter, FilterOperator, MessageToast, JSONModel, MessageBox) {
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
                    borrowingBookISBN: "",
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
                oRouter.navTo("RouteloginView", {}, true)

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

            onRefresh: function () {
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
            // onUpdateBook: function () {
            //     debugger
            //     var oPayload = this.getView().getModel("newBookModel").getData();
            //     var oTable = this.getView().byId("idBooksTable");
            //     var oSelectedItem = oTable.getSelectedItem();

            //     // if (!oSelectedItem) {
            //     //     MessageToast.show("Select a book to update");
            //     //     return;
            //     // }

            //     var oContext = oSelectedItem.getBindingContext();
            //     var oModel = oContext.getModel();

            //     // Update the properties directly on the context
            //     for (var prop in oPayload) {
            //         if (oPayload.hasOwnProperty(prop)) {
            //             oContext.setProperty(prop, oPayload[prop]);
            //         }
            //     }
            //     const oAvalStock = parseInt(oPayload.availableQuantity)
            //     const oStock = parseInt(oPayload.quantity)
            //     if (oAvalStock <= oStock) {
            //         // Submit the changes
            //         oModel.submitBatch("updateGroup").then(function () {
            //             oTable.getBinding("items").refresh();
            //             this.oCreateBookPop.close();
            //             MessageToast.show("Book Updated Successfully");
            //         }.bind(this)).catch(function (oError) {
            //             this.oCreateBookPop.close();
            //             sap.m.MessageBox.error("Failed to update book: " + oError.message);
            //         }.bind(this));
            //     } else {
            //         MessageToast.show("Avilable Stock should be lesser or equal to the Stock")
            //     }
            // },
            onCreateBtnPress: async function () {
                debugger
                if (!this.oCreateBookPop) {
                    this.oCreateBookPop = await this.loadFragment("createBook")
                }
                this.oCreateBookPop.open()

            },

            onUpdateBook: function () {
                debugger
                var oPayload = this.getView().getModel("newBookModel").getData()
                var oTable = this.getView().byId("idBooksTable");
                var oSelectedItem = oTable.getSelectedItem();
                var sBookName = oSelectedItem.getBindingContext().getObject().title
                var oModel = this.getView().getModel()

                var oBookBinding = oModel.bindList("/Books");
                oBookBinding.filter([
                    new Filter("title", FilterOperator.EQ, sBookName)
                ]);

                var oThis = this
                oBookBinding.requestContexts().then(function (aBookContexts) {
                    if (aBookContexts.length > 0) {
                        var oBookContext = aBookContexts[0];
                        var oBookData = oBookContext.getObject()
                        //  oBookData.title = oPayload.title
                        //  oBookData.authorName = oPayload.authorName
                        //  oBookData.quantity = oPayload.quantity
                        //  oBookData.availableQuantity =oPayload.availableQuantity
                        //  oBookData.ISBN = oPayload.ISBN

                        oBookContext.setProperty("title", oPayload.title);
                        oBookContext.setProperty("authorName", oPayload.authorName);
                        oBookContext.setProperty("quantity", oPayload.quantity);
                        oBookContext.setProperty("availableQuantity", oPayload.availableQuantity);
                        oBookContext.setProperty("ISBN", oPayload.ISBN);

                        const oAvalStock = parseInt(oPayload.availableQuantity)
                        const oStock = parseInt(oPayload.quantity)
                        if (oAvalStock <= oStock) {
                            // Submit the changes
                            oModel.submitBatch("updateGroup").then(function () {
                                oTable.getBinding("items").refresh();
                                oThis.getView().byId("idAuthorName").setValue("")
                                oThis.getView().byId("idbookNameInput").setValue("")
                                oThis.getView().byId("idStockInput").setValue("")
                                oThis.getView().byId("idavailableQuantityInput").setValue("")
                                oThis.getView().byId("idbooks_ISBNInput").setValue("")
                                oThis.oCreateBookPop.close();
                                MessageToast.show("Book Updated Successfully");
                            }).catch(function (oError) {
                                oThis.oCreateBookPop.close();
                                sap.m.MessageBox.error("Failed to update book: " + oError.message);
                            })
                        } else {
                            MessageToast.show("Avilable Stock should be lesser or equal to the Stock")
                        }

                    } else {
                        MessageToast.show("Book not found");
                    }
                });
            },
            onCreateBook: function () {
                debugger
                var oView = this.getView()
                var oModel = this.getView().getModel(),
                    oBinding = oModel.bindList("/Books")
                // var oContext = this.getView().byId("idBooksTable").getBinding("items")
                var oNewBook = this.getView().getModel("newBookModel").getData()


                var iAvalStock = oNewBook.availableQuantity
                var iStock = oNewBook.quantity

                if (iStock >= iAvalStock) {
                    oBinding.create(oNewBook, {
                        success: MessageToast.show("Book created successfully"),
                        refresh: oView.byId("idBooksTable").getBinding("items").refresh(),
                        // setData:oView.getModel("newBookModel").setData(),
                        error: function () {
                            MessageToast.show("Error creating book");
                        }
                    });

                    oView.byId("idAuthorName").setValue("")
                    oView.byId("idbookNameInput").setValue("")
                    oView.byId("idStockInput").setValue("")
                    oView.byId("idavailableQuantityInput").setValue("")
                    oView.byId("idbooks_ISBNInput").setValue("")

                    this.oCreateBookPop.close()
                    // this.getView().byId("idBooksTable").getBinding("items").refresh()
                } else {
                    MessageToast.show("Avilable Stock should be lesser or equal to the Stock")
                }

            },
            onCloseCreateBookDailog: function () {
                if (this.oCreateBookPop.isOpen()) {
                    this.oCreateBookPop.close()
                }
            },
            onDeleteBooks: async function () {
                const oselected = this.getView().byId("idBooksTable").getSelectedItem()
                if (oselected) {
                    if (!this.oConfirmBookDel) {
                        this.oConfirmBookDel = await this.loadFragment("confirmDeleteBook")
                    }
                    this.oConfirmBookDel.open()
                } else {
                    MessageToast.show("Select a record to delete")
                }
            },

            // onDeleteSelected: function () {
            //     var oTable = this.byId("myTable");
            //     var aSelectedItems = oTable.getSelectedItems();

            //     if (aSelectedItems.length === 0) {
            //         MessageBox.warning("Please select at least one item to delete.");
            //         return;
            //     }

            //     MessageBox.confirm("Are you sure you want to delete the selected items?", {
            //         actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.YES) {
            //                 this._deleteSelectedItems(aSelectedItems);
            //             }
            //         }.bind(this)
            //     });
            // },

            //         _deleteSelectedItems: function (aSelectedItems) {
            //             var oModel = this.getView().getModel();
            // var aPromises = [];

            // aSelectedItems.forEach(function (oItem) {
            //     var sPath = oItem.getBindingContext().getPath();
            //     aPromises.push(new Promise(function (resolve, reject) {
            //         oModel.remove(sPath, {
            //             success: resolve,
            //             error: reject
            //         });
            //     }));
            // });

            //             Promise.all(aPromises)
            //                 .then(function () {
            //                     MessageBox.success("Selected items deleted successfully.");
            //                     oTable.removeSelections(true); // Deselect all items
            //                 })
            //                 .catch(function () {
            //                     MessageBox.error("Error occurred while deleting items.");
            //                 });
            //         }
            //     });
            // })

            onConfirmDeleteButtonPress: function () {
                debugger;
                var othis = this
                var oSelected = this.byId("idBooksTable").getSelectedItems();
                if (oSelected) {
                    // var oBookName = oSelected.getBindingContext().getObject().title;
                    // var oBookAvilableQnty = oSelected.getBindingContext().getObject().availableQuantity;
                    // var oBookTotalQnty = oSelected.getBindingContext().getObject().quantity;
                    var aBindingContexts = [];

                    oSelected.forEach(function (oItem) {
                        var oBindingcontext = oItem.getBindingContext();
                        aBindingContexts.push(oBindingcontext)
                    });

                    aBindingContexts.forEach(function (oRecord) {
                        var avail = oRecord.getObject().availableQuantity
                        var Stock = oRecord.getObject().quantity

                        if (avail === Stock) {
                            oRecord.delete("$auto")
                            MessageToast.show("Book Deleted");
                            othis.oConfirmBookDel.close()
                            // othis.getView().byId("idBooksTable").getBinding("items").refresh()
                        } else {
                            MessageToast.show("You can not delete the issued book")
                        }
                    });
                } else {
                    MessageToast.show("Please Select a Book to Delete");
                }
            },
            onCloseIssueBookButton: function () {
                if (this.oConfirmBookDel.isOpen()) {
                    this.oConfirmBookDel.close()
                }
            },

            onActiveLoansClick: async function () {
                debugger
                if (!this.oActiveLoanPopUp) {
                    this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                    // this.oNewLoanDailog = await this.loadFragment("loanCreate")
                    // this.oReservationsDialog = await this.loadFragment("Reservations")

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

            onIssueBookFromReservations: function () {
                debugger


                const oAdminView = this.getView(),
                    oSelected = oAdminView.byId("idReservationsTable").getSelectedItem()
                if (!oSelected) {
                    MessageToast.show("Please select a reservation to issue the book");
                }
                const oUserContext = oSelected.getBindingContext(),
                    oUserName = oSelected.getBindingContext().getObject().ReservedUserName,
                    oUserId = oSelected.getBindingContext().getObject().ReservedUserId,
                    oBookName = oSelected.getBindingContext().getObject().ReservedBook;

                let futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 15);
                var oYear = futureDate.getFullYear()
                var oMonth = futureDate.getMonth() + 1
                var oDay = futureDate.getDate()
                var oDateAfter15days = `${oYear}-${oMonth}-${oDay}`



                const oModel = this.getView().getModel(),
                    oBooksTable = this.getView().byId("idBooksTable");

                // Find the book in the books table and check the available quantity
                var oBookBinding = oModel.bindList("/Books");
                oBookBinding.filter([
                    new Filter("title", FilterOperator.EQ, oBookName)
                ]);

                oBookBinding.requestContexts().then(function (aBookContexts) {
                    if (aBookContexts.length > 0) {
                        var oBookContext = aBookContexts[0];
                        var oBookData = oBookContext.getObject();

                        if (oBookData.availableQuantity > 0) {
                            const oBindList = oModel.bindList("/Activeloans");
                            oBindList.create({
                                borrowerName: oUserName,
                                borrowerUserId: oUserId,
                                borrowingBookName: oBookName,
                                dueOn: oDateAfter15days
                            })
                            oUserContext.delete("$auto").then(function () {
                                MessageToast.show("Book Issued")
                            })
                            oBookData.availableQuantity -= 1; // Updating qty
                            oBookContext.setProperty("availableQuantity", oBookData.availableQuantity);
                            oModel.submitBatch("updateGroup");

                        } else {
                            MessageToast.show("Book not available yet")
                        }
                    } else {
                        MessageToast.show("Book not available to issue")
                    }
                });
            },

            onReservationsClose: function () {
                if (this.oReservationsDialog.isOpen()) {
                    this.oReservationsDialog.close();
                }
            },
            onAddNewLoanPress: async function () {
                debugger
                let futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 15);

                var oYear = futureDate.getFullYear()
                var oMonth = futureDate.getMonth() + 1
                var oDay = futureDate.getDate()
                var oDateAfter15days = `${oYear}-${oMonth}-${oDay}`


                if (!this.oNewLoanDailog) {
                    // this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                    this.oNewLoanDailog = await this.loadFragment("loanCreate")
                    // this.oReservationsDialog = await this.loadFragment("Reservations")


                    const newLoanModel = new JSONModel({
                        borrowerName: "",
                        borrowerUserId: "",
                        borrowingBookName: "",
                        borrowingBookISBN: "",
                        dueOn: oDateAfter15days
                    });
                    this.getView().setModel(newLoanModel, "newLoanModel");

                }
                this.oNewLoanDailog.open()
            },
            onNewLoanDailogClose: function () {
                if (this.oNewLoanDailog.isOpen()) {
                    this.oNewLoanDailog.close();
                }
            },
            onDateChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                // Regular expression to validate date format YYYY-MM-DD
                var regex = /^\d{4}-\d{2}-\d{2}$/;

                if (sValue.match(regex)) {
                    // Check current date
                    var enteredDate = new Date(sValue);
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);  // Set to midnight to only compare dates

                    if (enteredDate >= currentDate) {
                        oInput.setValueState("None");
                        MessageToast.show("Date is valid")
                        // const flag = true
                    } else {
                        oInput.setValueState("Error");
                        MessageToast.show("Date cannot be in the past date.");
                    }
                } else {
                    oInput.setValueState("Error");
                    MessageToast.show("Invalid date format. Please use YYYY-MM-DD.");
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
                    var sEnteredBookISBN = oNewLoan.borrowingBookISBN;
                    var sBookName = oNewLoan.borrowingBookName;
                    var othis = this

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
                                    new Filter("title", FilterOperator.EQ, sBookName),
                                    new Filter("ISBN", FilterOperator.EQ, sEnteredBookISBN)
                                ]);

                                oBookBinding.requestContexts().then(function (aBookContexts) {
                                    if (aBookContexts.length > 0) {
                                        var oBookContext = aBookContexts[0];
                                        var oBookData = oBookContext.getObject();

                                        if (oBookData.availableQuantity > 0) {
                                            oBookData.availableQuantity -= 1; // Updating qty
                                            oBindList.create(oNewLoan); //newloan 
                                            oBookContext.setProperty("availableQuantity", oBookData.availableQuantity);
                                            oModel.submitBatch("updateGroup").then(function () {
                                                othis.oNewLoanDailog.close();
                                                MessageToast.show("Book issued")


                                            })
                                        } else {
                                            MessageToast.show("Book not available")
                                        }
                                    } else {
                                        MessageToast.show("Book data not found");
                                    }
                                });

                            } else {
                                MessageToast.show("User data not matching with existing records");
                            }
                        });
                        // this.oActiveLoanPopUp.close();
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
                        MessageToast.show(oUser + " Loan Closed");

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
                    }, function (error) {
                        MessageToast.show("Deletion Error: " + error.message);
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

