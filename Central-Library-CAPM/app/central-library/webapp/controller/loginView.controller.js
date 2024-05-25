sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageToast) {
        "use strict";

        return Controller.extend("com.app.centrallibrary.controller.loginView", {
            onInit: function () {
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
            onUserLoginPress: function () {
                debugger
                var oView = this.getView(),
                    userId = oView.byId("idUserIDInput").getValue(),
                    Password = oView.byId("idPasswordInput").getValue()
                    // &amp;
                if (userId === "subhash@sap.com" && Password === "1234") {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteAdminView")
                    var userId = oView.byId("idUserIDInput").setValue(""),
                        Password = oView.byId("idPasswordInput").setValue("")
                }
                else {
                    MessageToast.show("Invalid Credentials");

                }

            },

        });
    });

