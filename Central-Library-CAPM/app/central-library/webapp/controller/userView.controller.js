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
                    dueOn: ""
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
            onLogoutPress:function(){
                debugger
                const oRouter = this.getOwnerComponent().getRouter()
                oRouter.navTo("RouteloginView")

            },
            onReserveBookPress: async function () {
                debugger
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    // var oStock = oSelected.getBindingContext().getObject().quantity
                    var oAvailStock = oSelected.getBindingContext().getObject().availableQuantity
                    if(oAvailStock === "0"){
                        MessageToast.show("Reservation Sent to Admin")
                    }
                    else{
                        MessageToast.show("Book is available you don't need to reserve")
                    }
                }
            },
        });
    }
);
