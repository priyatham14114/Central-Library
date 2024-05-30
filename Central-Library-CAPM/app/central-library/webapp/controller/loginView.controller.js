sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.centrallibrary.controller.loginView", {
            onInit: function () {
                debugger
                // const oPage = this.getView().byId("idLoginObjectPage");
                // oPage.attachBrowserEvent("dblclick", this.onDoubleClick.bind(this));

            },
            // onLoginPress: async function () {
            //     debugger
            //     if (!this.oLoginDialog) {
            //         this.oLoginDialog = await Fragment.load({
            //             name: "com.app.centrallibrary.fragments.loginPopup",
            //             controller: this

            //         });
            //         this.oLoginDialog = Fragment.byId("loginDialog");
            //     }
            //     this.oLoginDialog.open();
            // },

            onLoginPress: async function () {
                if (!this.oLoginDailogPopUp) {
                    this.oLoginDailogPopUp = await this.loadFragment("loginPopup")
                }
                this.oLoginDailogPopUp.open();

            },
           
            onCloseLoginDailog: function () {
                if (this.oLoginDailogPopUp.isOpen()) {
                    this.oLoginDailogPopUp.close()

                }
            },
            // onUserLoginPress: function () {
            //     debugger
            //     var oView = this.getView(),
            //         userId = oView.byId("idUserIDInput").getValue(),
            //         Password = oView.byId("idPasswordInput").getValue()
            //         // &amp;
            //             const oRouter = this.getOwnerComponent().getRouter();
            //         oRouter.navTo("RouteAdminView")
            //     // if (userId === "subhash@sap.com" && Password === "1234") {
            //     //     const oRouter = this.getOwnerComponent().getRouter();
            //     //     oRouter.navTo("RouteAdminView")
            //     //     var userId = oView.byId("idUserIDInput").setValue(""),
            //     //         Password = oView.byId("idPasswordInput").setValue("")
            //     // }
            //     // else {
            //     //     MessageToast.show("Invalid Credentials");

            //     // }

            // },
            onUserLoginPress: function () {
                var oView = this.getView();

                var sUserID = oView.byId("idUserIDInput").getValue();
                var sPassword = oView.byId("idPasswordInput").getValue();

                if (!sUserID || !sPassword) {
                    MessageToast.show("please enter required Credentials");
                    return;
                }

                var oModel = this.getView().getModel();
                var oBinding = oModel.bindList("/UserLogin");

                oBinding.filter([
                    new Filter("userid", FilterOperator.EQ, sUserID),
                    new Filter("userpassword", FilterOperator.EQ, sPassword)
                ]);

                oBinding.requestContexts().then(function (aContexts) {  //requestContexts is called to get the contexts (matching records) from the backend.
                    debugger
                    if (aContexts.length > 0) {
                        var ID = aContexts[0].getObject().ID;
                        var userType = aContexts[0].getObject().typeOfUser;
                        if (userType === "Admin") {
                            MessageToast.show("Login Successful");
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteAdminView", { userId: ID });
                            var oView = this.getView()
                            oView.byId("idUserIDInput").setValue("");
                            oView.byId("idPasswordInput").setValue("");
                        }
                        else {
                            MessageToast.show("Login Successful");
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteUserView", { userId: ID });
                            var oView = this.getView()
                            oView.byId("idUserIDInput").setValue("");
                            oView.byId("idPasswordInput").setValue("");
                        }

                    } else {
                        MessageToast.show("Invalid username or password.");
                    }
                }.bind(this)).catch(function () {
                    MessageToast.show("An error occurred during login.");
                });
            },
            onSignUpPress: async function () {
                if (!this.oSignUpDialog) {
                    this.oSignUpDialog = await this.loadFragment("Signup")
                }
                this.oSignUpDialog.open()
            },
            onSignUpCancel: function () {
                if (this.oSignUpDialog.isOpen()) {
                    this.oSignUpDialog.close()
                }

            }


        });
    });

