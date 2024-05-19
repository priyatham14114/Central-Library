namespace my.bookshop;

using {cuid} from '@sap/cds/common';

entity Books : cuid {
  author   : String;
  title    : String;
  ISBN     : Integer;
  quantity : Integer;
}

entity AdminLogin : cuid {
  name          : String;
  adminid       : String;
  adminpassword : String;

}

entity UserLogin : cuid {
  userName     : String;
  userid       : String;
  userpassword : String;
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
