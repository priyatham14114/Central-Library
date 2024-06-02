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
                const newReservationModel = new JSONModel({
                    ReserverdUserName:"",
                    ReserverdUserId:"",
                    ReserverdBook:""
                });
                this.getView().setModel(newReservationModel, "newReservationModel");
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
                const oView = this.getView()
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    // var oStock = oSelected.getBindingContext().getObject().quantity
                    var oAvailStock = oSelected.getBindingContext().getObject().availableQuantity,
                     oBookName = oSelected.getBindingContext().getObject().title,
                     oUser = oView.byId("idUserName").getText(),
                     oUserId = oView.byId("idUserIdLink").getText()
                    
                    if(oAvailStock === "0"){
                        // const newReservationModel = new JSONModel({
                        //     ReserverdUserName:oUser,
                        //     ReserverdUserId:oUserId,
                        //     ReserverdBook:oBookName
                        // });
                        // this.getView().setModel(newReservationModel, "newReservationModel");
                        
                        const oBinding = oView.getModel().bindList("/Reservations")
                        oBinding.create({
                            ReserverdUserName:oUser,
                            ReserverdUserId:oUserId,
                            ReserverdBook:oBookName

                        })

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
