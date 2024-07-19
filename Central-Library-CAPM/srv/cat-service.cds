using my.bookshop as my from '../db/data-model';

//   @restrict: [{
//         grant: '*' ,
//         to : 'Admin'
//     }]
@path: '/LibrarySrv'
service CatalogService {
    entity Books      as projection on my.Books;
    entity UserLogin as projection on my.UserLogin;
    entity Activeloans as projection on my.Activeloans;
    entity Reservations as projection on my.Reservations;
}