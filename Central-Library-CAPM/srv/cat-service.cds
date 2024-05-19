using my.bookshop as my from '../db/data-model';

@path: '/LibrarySrv'
service CatalogService {
    entity Books      as projection on my.Books;
    entity AdminLogin as projection on my.AdminLogin;
    entity UserLogin as projection on my.UserLogin;
}
