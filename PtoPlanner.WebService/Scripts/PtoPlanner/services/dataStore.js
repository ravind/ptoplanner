app.factory('pto', function ($resource) {
    return $resource('/api/PtoList/:year');
});

app.factory('Setup', function ($resource) {
    return $resource('/api/Settings/2014', { year: '@_year' }, {
        query: {
            method: 'GET',
            isArray: false
        },
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });
});

app.service('dataStore', function ($http) {
    "use strict";
    var urls = {};
    urls.ptoList = "/api/Pto";
    urls.Settings = "/api/Settings";
    var that = this;
    this.setObject = function (key, object) {
        that.modalShow();
        $http.post(urls[key], object)
            .success(function (data, status, headers, config) {
                that.modalHide();
            }).error(function (d, status, headers, config) {
                console.log(status);
                if (d.Message === "Settings for this year already exist.") {
                    that.putObject(key, object);
                }
            });
    };
    this.putObject = function (key2, object2) {
        that.modalShow();
        $http.put(urls[key2] + "/" + object2.SettingsYear, object2)
            .success(function (data, status, headers, config) {
                that.modalHide();
            }).error(function (d, status, headers, config) {
                console.log(status);
            });
    };

    this.delObject = function (id) {
        id = id.split('/');
        id = id.pop();
        that.modalShow();
        $http.delete(urls['ptoList'] + '/' + id)
            .success(function (data, status, headers, config) {
                that.modalHide();
            }).error(function (data, status, headers, config) {
                console.log(status);
            });
    };
    var $modalparts = $('.modal, .modal-backdrop');
    this.modalShow = function () {
        $modalparts.show();
    }
    this.modalHide = function () {
        $modalparts.hide();
    }
});
