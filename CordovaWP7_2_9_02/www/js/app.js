function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var User = {
    create : function() {
        var u = {
            id: guid(),
            age: getRandomInt(12, 30),
            name: Faker.Name.findName()
        }; 
        return u;
    },
    _users: [],
    all : function() {
        return this._users;
    },
    get : function(id) {
        for (var n = 0; n < this._users.length; n++) {
            if (this._users[n].id == id) return this._users[n];
        }
        return null;
    }
};


var ListPage = function (bus) {
    var self = this;
    self.users = ko.observableArray(User.all());
    self.add = function () {
        var u = User.create();
        self.users.push(u);
    };

    self.show = function(user) {
        bus.trigger('show-user', user.id);
    };

    self.template = 'list';
};

var DetailsPage = function (model) {
    var self = this;

    self.name = ko.observable(model.name);
    self.age = ko.observable(model.age);

    self.template = 'details';
};

var StatisticPage = function() {
    var self = this;
    self.users = ko.observableArray(User.all());

   
    self.afterRender = function() {
        var data =[];

        for (var n = 0; n < self.users().length; n++) {
            var u = self.users()[n];
            data.push([u.name, u.age]);
        }

        var plot1 = jQuery.jqplot('chart1', [data],
            {
                seriesDefaults: {
                    // Make this a pie chart.
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                        // Put data labels on the pie slices.
                // By default, labels show the percentage of the slice.
                        showDataLabels: true
                    }
                },
                legend: { show: true, location: 'e' }
            }
        );
    };
    

    self.template = 'statistic';
};

var pub_sub = $({});

var app = {
    title: ko.observable('list'),
    showList: function () {
        app.title('list');
        app.content(new ListPage(pub_sub));
    },
    showDetails : function(id) {
        app.title('details');
        var u = User.get(id);
        app.content(new DetailsPage(u));
    },
    showStatistic : function() {
        app.title('diagram');
        app.content(new StatisticPage);
        app.content().afterRender();
    },
    start : function() {
        ko.applyBindings(this);

        pub_sub.on('show-user', function (e, id) {
            app.showDetails(id);
        });

        app.showList();
    },
    content: ko.observable(null)
};





