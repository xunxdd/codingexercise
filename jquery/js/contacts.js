var ContactsModule = (function ($) {
    var  contactUrl= '../data/Contacts.json',
         outletUrl= '../data/Outlets.json',
         contacts,
         outlets,
         fullData;

    var getData = function (div) {
        $.when(

            $.get(contactUrl, function (data) {
                contacts = data;
            }),

            $.get(outletUrl, function(data) {
                outlets = data;
            })

         ).then(function () {

            fullData = contacts.map(function(contact) {
                var outLet = outlets.filter(function(olet) {
                    return olet.id === contact.outletId;
                });

                contact.fullName = contact.firstName + ' ' + contact.lastName;

                if (outLet && outLet.length) {
                    contact.outletName = outLet[0].name;
                }
                return contact;
            });

            _setUpDataTable(fullData, div);
        });
    };

    var _setUpDataTable = function(data, div) {

        div.dataTable({
            data: data,
            pageLength: 25,
            scrollY: 500,
            ordering: true,
            columns: [
                 { "data": "fullName" },
                 { "data": "title" },
                 { "data": "outletName" },
                 { "data": "profile" }
            ],
            "columnDefs": [
                { "width": "100px", "targets": 0 },
                { "width": "100px", "targets": 1 },
                { "width": "100px", "targets": 2 }

            ]
        });

    };

    return {
        getData: getData
    };

})(jQuery);

$(document).ready(function () {

    var table = $('#contactsTable');

    ContactsModule.getData(table);
});