namespace my.bookshop;

using {cuid} from '@sap/cds/common';

entity Books : cuid {
  authorName   : String;
  title    : String;
  ISBN     : String;
  quantity : Integer;
}

entity AdminLogin : cuid {
  name          : String;
  adminid       : String;
  adminpassword : String;
  // ActiveloanData : Association to Activeloans

}

entity UserLogin : cuid {
  userName     : String;
  userid       : String;
  userpassword : String;
  // activeloans  : Association to many Activeloans on activeloans.Borrower_userid=$self;
}

entity Activeloans : cuid {
  Borrower_userid : Association to UserLogin;
  Borrower_Name   : Association to UserLogin;
  BookName        : Association to Books;
  DueDate         : Date;
}


// entity Admin : cuid {
//   adminName   : String;
//   adminPhone  : Integer;
//   adminCity   : String;
//   Activeloans : Association to User;
// }

//
// entity BorrowedBooks : cuid {
//   booktitle : String;
//   author    : String
// }
