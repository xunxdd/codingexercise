Ext.define('Xun.codingExcercise.ContactsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.contacts',

    contactUrl: '../data/Contacts.json',
    outletUrl: '../data/Outlets.json',

    init: function () {
        var me = this;

        me.callParent();

        me.getData();
    },

    getData: function () {
        var me = this;

        me.getJson(me.contactUrl, 'contact');
        me.getJson(me.outletUrl, 'outlet');
    },

    getJson: function (url, dataType) {
        var me = this;
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function (response, opts) {
                var data = Ext.decode(response.responseText);
                me.handleData(data, dataType);
            },
            failure: function (response, opts) {
                console.log('oops, have an issue getting the data from ' + url);
            },
            scope: me
        });
    },

    handleData: function (data, dataType) {
        var me = this,
           fullData,
           view = me.getView();

        switch (dataType) {
            case 'contact':
                me.contactsData = data;
                break;
            case 'outlet':
                me.outletData = data;
                break;
            default:
                break;
        }

        if (me.contactsData && me.contactsData.length && me.outletData && me.outletData.length) {
            fullData = Ext.Array.map(me.contactsData, function (contact) {
                var outlet = Ext.Array.filter(me.outletData, function (olet) {
                    return contact.outletId === olet.id;
                });

                if (outlet && outlet.length) {
                    contact.outletName = outlet[0].name;
                }
                contact.fullName = contact.firstName + ' ' + contact.lastName;

                return contact;
            });
            view.addGrid(fullData);
        }
    }

});
