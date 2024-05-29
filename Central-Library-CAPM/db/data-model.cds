namespace my.bookshop;

using {cuid} from '@sap/cds/common';

// entity AdminLogin : cuid {
//   name          : String;
//   adminid       : String;
//   adminpassword : String;
// }

entity Books : cuid {
  authorName        : String;
  title             : String;
  ISBN              : String;
  quantity          : String;
  availableQuantity : String;
  users             : Composition of many UserLogin
                        on users.books = $self;

}

entity UserLogin : cuid {
  userName     : String;
  userid       : String;
  userpassword : String;
  loans        : Composition of many Activeloans
                   on loans.user = $self;
  books        : Association to Books;
  typeOfUser   : String;
  photo        : LargeString;
}

entity Activeloans : cuid {
  user  : Association to UserLogin;
  dueOn : Date;

}

entity MyActiveloans : cuid {
  bookName  : String;
  BookTitle : String;
  isbn      : String;
  myDueDate : Date;
}

// last change here
// make user is associated to many active loans change the relation


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
