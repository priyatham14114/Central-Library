sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel"

    ],
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        /**
       * @param {typeof sap.ui.core.mvc.Controller} Controller
       */
        return Controller.extend("com.app.centrallibrary.controller.userView", {
            onInit: function () {
                const newBorrowModel = new JSONModel({
                    authorName: "",
                    title: "",
                    ISBN: "",
                    DueDate: ""
                });
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
            },
            onCurrentUserDetails: function (oEvent) {
                const { userId } = oEvent.getParameter("arguments");
                this.ID = userId;
                const sRouterName = oEvent.getParameter("name");
                const oForm = this.getView().byId("idUserDataPage");
                oForm.bindElement(`/UserLogin(${userId})`, {
                    expand: ''
                });
            },
            onBorrowNewBookPress: async function () {
                debugger
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    // var oBook = oSelected.getBindingContext().getObject().ID;
                    var oAuthorName = oSelected.getBindingContext().getObject().authorName
                    var oBookname = oSelected.getBindingContext().getObject().title
                    // var oStock = oSelected.getBindingContext().getObject().quantity
                    var oISBN = oSelected.getBindingContext().getObject().ISBN

                    const newBorrowModel = new JSONModel({
                        authorName: oAuthorName,
                        title: oBookname,
                        ISBN: oISBN,
                        DueDate: "2024-2-3"
                    });
                    this.getView().setModel(newBorrowModel, "newBorrowModel");
                    var oContext = this.getView().byId("idUserActiveLoanTable").getBinding("items")
                    var oNewBook = this.getView().getModel("newBorrowModel").getData();
                    oContext.create(oNewBook, {
                        sucess: function () {
                            MessageToast.show("Book created successfully");
                        },
                        error: function () {
                            MessageToast.show("Error creating book");
                        }
                    });
                }
                else {
                    MessageToast.show("Select a Book to Borrow")
                }

            },
        });
    }
);
