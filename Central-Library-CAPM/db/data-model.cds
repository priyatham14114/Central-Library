namespace my.bookshop;

using {cuid} from '@sap/cds/common';

entity Books : cuid {
  authorName        : String;
  title             : String;
  ISBN              : String;
  quantity          : String;
  availableQuantity : String;
  // manyUsersloans    : Composition of many Activeloans
  //                       on manyUsersloans.takenbooks = $self

}

entity UserLogin : cuid {
  userName     : String;
  userid       : String;
  userpassword : String;
  // loans        : Composition of many Activeloans
  //                  on loans.user = $self;
  // books        : Association to Books;
  typeOfUser   : String;
  photo        : LargeString;
}

entity Activeloans : cuid {
  borrowerName : String;
  borrowerUserId : String;
  borrowingBookName : String;
  dueOn      : Date;
}
// entity Activeloans : cuid {
//   user       : Association to UserLogin;
//   takenbooks : Association to Books;
//   dueOn      : Date;
// }