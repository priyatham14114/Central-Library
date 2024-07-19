sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/worklistpage/test/integration/FirstJourney',
		'com/app/worklistpage/test/integration/pages/BooksList',
		'com/app/worklistpage/test/integration/pages/BooksObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/worklistpage') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage
                }
            },
            opaJourney.run
        );
    }
);