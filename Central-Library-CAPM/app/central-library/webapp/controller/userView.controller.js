sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/m/Token",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"

    ],
    function (Controller, MessageToast, JSONModel,Token,Filter,FilterOperator) {
        "use strict";

        /**
       * @param {typeof sap.ui.core.mvc.Controller} Controller
       */
        return Controller.extend("com.app.centrallibrary.controller.userView", {
            onInit: function () {

                const newReservationModel = new JSONModel({
                    ReservedUserName: "",
                    ReservedUserId: "",
                    ReservedBook: ""
                });
                this.getView().setModel(newReservationModel, "newReservationModel");

                // const oUserView = this.getView()
                // const sUser = oUserView.byId("idUserInputValue")

                // sUser.addValidator(function (args) {
                //     if (true) {
                //         var text = args.text;
                //         return new Token({ key: text, text: text });
                //     }
                // });


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
            onLogoutPress: function () {
                debugger
                const oRouter = this.getOwnerComponent().getRouter()
                oRouter.navTo("RouteloginView")

            },
            onRefresh: function () {
                this.getView().byId("idBooksTable").getBinding("items").refresh()
            },
            onReserveBookPress: async function () {
                debugger
                const oView = this.getView()
                var oSelected = this.byId("idBooksTable").getSelectedItem()
                if (oSelected) {
                    // var oStock = oSelected.getBindingContext().getObject().quantity
                    // oAvailStock = oSelected.getBindingContext().getObject().availableQuantity
                    var oAvailStock = oSelected.getBindingContext().getObject().availableQuantity,
                        oBookName = oSelected.getBindingContext().getObject().title,
                        oUser = oView.byId("idUserName").getText(),
                        oUserId = oView.byId("idUserIdLink").getText()

                    if (oAvailStock === "0") {

                        const oBinding = oView.getModel().bindList("/Reservations")
                        oBinding.create({
                            ReservedUserName: oUser,
                            ReservedUserId: oUserId,
                            ReservedBook: oBookName

                        })

                        MessageToast.show("Reservation Sent to Admin")
                    }
                    else {
                        MessageToast.show("Book is available you don't need to reserve")
                    }
                }else{
                    MessageToast.show("Select a book to reserve")
                }
            },
            onFilterCilck: function () {
                const oUserView = this.getView(),
                oBorrowTable = oUserView.byId("idUserActiveLoanTable"),
                    sBook = oUserView.byId("idUserInputValue").getValue()
                var aFilters = []

                sBook ? aFilters.push(new Filter("borrowingBookName", FilterOperator.EQ, sBook)): "";

                // sUser.filter((ele) => {
                //     ele ? aFilters.push(new Filter("borrowerName", FilterOperator.EQ, ele.getKey())) : "";
                // })
                oBorrowTable.getBinding("items").filter(aFilters);
            }

        });
    }
);
