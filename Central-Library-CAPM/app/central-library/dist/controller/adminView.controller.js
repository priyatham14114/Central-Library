sap.ui.define(["./baseController","sap/m/Token","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/ui/model/json/JSONModel"],function(e,t,o,i,n,a){"use strict";return e.extend("com.app.centrallibrary.controller.adminView",{onInit:function(){n.show("Welcome to the Central Library");const e=new a({authorName:"",title:"",quantity:"",availableQuantity:"",ISBN:""});const o=new a({borrowerName:"",borrowerUserId:"",borrowingBookName:"",dueOn:""});this.getView().setModel(e,"newBookModel");this.getView().setModel(o,"newLoanModel");const i=this.getView();const s=i.byId("idAuthorInputValue"),r=i.byId("idTitleInputValue");const l=[s,r];l.forEach(e=>{e.addValidator(function(e){if(true){var o=e.text;return new t({key:o,text:o})}})});const g=this.getOwnerComponent().getRouter();g.attachRoutePatternMatched(this.onCurrentUserDetails,this)},onCurrentUserDetails:function(e){const{userId:t}=e.getParameter("arguments");this.ID=t;const o=e.getParameter("name");const i=this.getView().byId("idAdminDataPage");i.bindElement(`/UserLogin(${t})`,{expand:""})},onLogoutPress:function(){const e=this.getOwnerComponent().getRouter();n.show("Successfully Logged Out");e.navTo("RouteloginView")},onFilterClick:function(){debugger;const e=this.getView(),t=e.byId("idAuthorInputValue").getTokens(),n=e.byId("idTitleInputValue").getTokens(),a=e.byId("idBooksTable"),s=[];var r=[t,n];r.forEach(e=>{if(e){e.filter(e=>{t.length>0?s.push(new o("authorName",i.EQ,e.getKey())):"";n.length>0?s.push(new o("title",i.EQ,e.getKey())):""})}});a.getBinding("items").filter(s)},onClear:function(){const e=this.getView(),t=e.byId("idAuthorInputValue").destroyTokens(),o=e.byId("idTitleInputValue").destroyTokens()},onRefresh:function(){this.getView().byId("idBooksTable").getBinding("items").refresh()},onEditBook:async function(){debugger;debugger;if(!this.oCreateBookPop){this.oCreateBookPop=await this.loadFragment("createBook")}var e=this.byId("idBooksTable").getSelectedItem();if(e){var t=e.getBindingContext().getObject().authorName;var o=e.getBindingContext().getObject().title;var i=e.getBindingContext().getObject().quantity;var s=e.getBindingContext().getObject().availableQuantity;var r=e.getBindingContext().getObject().ISBN;const n=new a({authorName:t,title:o,quantity:i,availableQuantity:s,ISBN:r});this.getView().setModel(n,"newBookModel");this.oCreateBookPop.open()}else{n.show("Select an Item to Edit")}},onUpdateBook:function(){debugger;var e=this.getView().getModel("newBookModel").getData();var t=this.getView().byId("idBooksTable");var o=t.getSelectedItem();if(!o){n.show("Select a book to update");return}var i=o.getBindingContext();var a=i.getModel();for(var s in e){if(e.hasOwnProperty(s)){i.setProperty(s,e[s])}}a.submitBatch("updateGroup").then(function(){t.getBinding("items").refresh();this.oCreateBookPop.close();n.show("Book Updated Successfully")}.bind(this)).catch(function(e){this.oCreateBookPop.close();sap.m.MessageBox.error("Failed to update book: "+e.message)}.bind(this))},onCreateBtnPress:async function(){debugger;if(!this.oCreateBookPop){this.oCreateBookPop=await this.loadFragment("createBook")}this.oCreateBookPop.open()},onCreateBook:function(){debugger;var e=this.getView();var t=this.getView().getModel(),o=t.bindList("/Books");var i=this.getView().getModel("newBookModel").getData();o.create(i,{success:function(){n.show("Book created successfully")},refresh:e.byId("idBooksTable").getBinding("items").refresh(),error:function(){n.show("Error creating book")}});this.oCreateBookPop.close()},onCloseLoginDailog:function(){if(this.oCreateBookPop.isOpen()){this.oCreateBookPop.close()}},onDeleteBooks:function(e){var t=this.byId("idBooksTable").getSelectedItem();if(t){var o=t.getBindingContext().getObject().title;t.getBindingContext().delete("$auto").then(function(){n.show(o+" SuccessFully Deleted")},function(e){n.show("Deletion Error: ",e)});this.getView().byId("idBooksTable").getBinding("items").refresh()}else{n.show("Please Select a Book to Delete")}},onActiveLoansClick:async function(){debugger;if(!this.oActiveLoanPopUp){this.oActiveLoanPopUp=await this.loadFragment("ActiveLoans");this.oNewLoanDailog=await this.loadFragment("loanCreate");this.oReservationsDialog=await this.loadFragment("Reservations")}this.oActiveLoanPopUp.open();this.getView().byId("idLoanTable").getBinding("items").refresh()},onCloseActiveLoans:function(){if(this.oActiveLoanPopUp.isOpen()){this.oActiveLoanPopUp.close()}},onReservationsClick:async function(){debugger;if(!this.oReservationsDialog){this.oReservationsDialog=await this.loadFragment("Reservations")}this.getView().byId("idReservationsTable").getBinding("items").refresh();this.oReservationsDialog.open()},onReservationsClose:function(){if(this.oReservationsDialog.isOpen()){this.oReservationsDialog.close()}},onAddNewLoanPress:async function(){debugger;if(!this.oNewLoanDailog){this.oActiveLoanPopUp=await this.loadFragment("ActiveLoans");this.oNewLoanDailog=await this.loadFragment("loanCreate");this.oReservationsDialog=await this.loadFragment("Reservations")}this.oNewLoanDailog.open()},onNewLoanDailogClose:function(){if(this.oNewLoanDailog.isOpen()){this.oNewLoanDailog.close()}},onDateChange:function(e){var t=e.getSource();var o=t.getValue();var i=/^\d{4}-\d{2}-\d{2}$/;if(o.match(i)){var a=new Date(o);var s=new Date;s.setHours(0,0,0,0);if(a>=s){t.setValueState("None");n.show("Date is valid");const e=true}else{t.setValueState("Error");n.show("Date cannot be in the past date.")}}else{t.setValueState("Error");n.show("Invalid date format. Please use YYYY-MM-DD.")}},onSaveNewLoan:function(){try{debugger;var e=this.getView().getModel(),t=e.bindList("/Activeloans");var a=this.getView().getModel("newLoanModel").getData();var s=a.borrowerUserId;var r=a.borrowerName;var l=a.borrowingBookName;if(s){var e=this.getView().getModel();var g=e.bindList("/UserLogin");g.filter([new o("userid",i.EQ,s),new o("userName",i.EQ,r)]);g.requestContexts().then(function(s){debugger;if(s.length>0){var r=e.bindList("/Books");r.filter([new o("title",i.EQ,l)]);r.requestContexts().then(function(o){if(o.length>0){var i=o[0];var s=i.getObject();t.create(a);s.availableQuantity-=1;i.setProperty("availableQuantity",s.availableQuantity);e.submitBatch("updateGroup",{success:function(){n.show("Book Issued Successfully")},error:function(e){n.show("Error updating book quantity")}})}else{n.show("Book not found")}})}else{n.show("User data not matching with existing records")}});this.oNewLoanDailog.close();this.oActiveLoanPopUp.close()}else{n.show("Enter correct user Data to Continue")}}catch(e){n.show(e)}},onClearLoan:async function(){debugger;if(!this.oDeleteCautionDailog){this.oDeleteCautionDailog=await this.loadFragment("confirmDelete")}this.oDeleteCautionDailog.open()},oDeleteCautionDailogClose:function(){if(this.oDeleteCautionDailog.isOpen()){this.oDeleteCautionDailog.close()}},onClearLoanButtonPress:function(){debugger;const e=this.getView(),t=e.byId("idLoanTable").getSelectedItem();if(t){var a=t.getBindingContext(),s=a.getObject(),r=s.borrowingBookName,l=this.getView().getModel(),g=s.borrowerName;a.delete("$auto").then(function(){n.show(g+" Successfully Deleted");var e=l.bindList("/Books");e.filter([new o("title",i.EQ,r)]);e.requestContexts().then(function(e){if(e.length>0){var t=e[0];var o=t.getObject();var i=o.availableQuantity;var a=parseInt(i);var s=a+1;t.setProperty("availableQuantity",s);l.submitBatch("updateGroup",{success:function(){n.show("Book quantity updated successfully")},error:function(e){n.show("Error updating book quantity: "+e.message)}})}else{n.show("Book not found")}})},function(e){n.show("Deletion Error: "+e.message)});this.getView().byId("idLoanTable").getBinding("items").refresh()}else{n.show("Please Select a user to close the loan")}this.oDeleteCautionDailog.close()}})});