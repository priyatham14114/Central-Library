using CatalogService as service from '../../srv/cat-service';
annotate service.Books with @(
    
    SelectionFields: [
        title,
        authorName
    ], 

    UI.FieldGroup #GeneratedGroup : {

       

        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'authorName',
                Value : authorName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ISBN',
                Value : ISBN,
            },
            {
                $Type : 'UI.DataField',
                Label : 'quantity',
                Value : quantity,
            },
            {
                $Type : 'UI.DataField',
                Label : 'availableQuantity',
                Value : availableQuantity,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'authorName',
            Value : authorName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'title',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ISBN',
            Value : ISBN,
        },
        {
            $Type : 'UI.DataField',
            Label : 'quantity',
            Value : quantity,
        },
        {
            $Type : 'UI.DataField',
            Label : 'availableQuantity',
            Value : availableQuantity,
        },
    ],
);

// annotate service.Activeloans with @(
//     UI.FieldGroup #GeneratedGroup2 : {
//         $Type : 'UI.FieldGroupType',
//         Data : [
//             {
//                 $Type : 'UI.DataField',
//                 Label : 'borrowerName',
//                 Value : borrowerName,
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Label : 'borrowerUserId',
//                 Value : borrowerUserId,
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Label : 'borrowingBookName',
//                 Value : borrowingBookName,
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Label : 'dueOn',
//                 Value : dueOn,
//             }
//         ],
//     },
//     UI.Facets : [
//         {
//             $Type : 'UI.ReferenceFacet',
//             ID : 'GeneratedFacet2',
//             Label : 'General Information',
//             Target : '@UI.FieldGroup#GeneratedGroup2',
//         },
//     ],
//     UI.LineItem : [
//         {
//             $Type : 'UI.DataField',
//             Label : 'borrowerName',
//             Value : borrowerName,
//         },
//         {
//             $Type : 'UI.DataField',
//             Label : 'borrowerUserId',
//             Value : borrowerUserId,
//         },
//         {
//             $Type : 'UI.DataField',
//             Label : 'borrowingBookName',
//             Value : borrowingBookName,
//         },
//         {
//             $Type : 'UI.DataField',
//             Label : 'dueOn',
//             Value : dueOn,
//         },

//     ],
// );

