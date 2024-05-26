sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        /**
       * @param {typeof sap.ui.core.mvc.Controller} Controller
       */
        return Controller.extend("com.app.centrallibrary.controller.userView", {
            onInit: function () {
            },
            // onBorrowNewBookPress: async function () {
            //     if (!this.oNewBookBorrowDailog) {
            //         this.oNewBookBorrowDailog = await this.loadFragment("booksTable")
            //     }
            //     this.oNewBookBorrowDailog.open()
            // }
        });
    }
);
