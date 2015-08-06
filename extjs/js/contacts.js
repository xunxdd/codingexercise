Ext.define('Xun.codingExcercise.Contacts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contacts',
    requires: [
       'Xun.codingExcercise.ContactsController'
    ],

    controller: 'contacts',

    stripeRows: true,

    title: '<h2>Coding Excercise - Ext Implementation <a href="../jquery/index.html">View jQuery Implementation</a></h2>',

    autoScroll: true,

    addGrid: function (data) {
        var me = this,
            store,
            columns,
            bbar;

       store = Ext.create('Ext.data.Store', {
            fields: ['fullName', 'title', 'outletName', 'profile'],
            pageSize: 25,
            data: data,
            remoteSort:true,
            sorters: [
                {
                    property: 'fullName',
                    direction: 'ASC'
                }
            ],
            proxy: {
                type: 'memory',
                enablePaging: true,
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            }
        });

        columns = [
            {
                text: 'Contact Name',
                width: 120,
                dataIndex: 'fullName',
                align: 'left'
            },
            {
                text: 'Contact Title',
                width: 120,
                dataIndex: 'title',
                align: 'left'
            },
            {
                text: 'Outlet Name',
                width: 120,
                dataIndex: 'outletName',
                align: 'left'
            },
            {
                text: 'Profile',
                flex: 1,
                dataIndex: 'profile',
                align: 'left'
            }
        ];

        bbar = Ext.create('Ext.PagingToolbar', {
            displayInfo: true,
            afterPageText: '',
            store: store,
            displayMsg: 'Displaying contacts {0} - {1} of {2}',
            emptyMsg: "No data to display"
        });

        me.add({
            xtype: 'grid',
            height:500,
            store: store,
            columns: columns,
            bbar: bbar
        });
    }

})