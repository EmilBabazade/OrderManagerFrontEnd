angular.module('order')
    .directive("selectNgFiles", function() {
        return {
            require: "ngModel",
            link: function postLink(scope,elem,attrs,ngModel) {
                elem.on("change", function(e) {
                    var files = elem[0].files;
                    ngModel.$setViewValue(files);
                })
            }
        }
    }); 

angular
    .module('order')
    .component('order', {
        templateUrl: 'order/order.html',
        controller: function($window, $location, loginService, orderService, vaqonService) {
            // topbar name surname
            const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
            this.name = capitalize($window.localStorage.getItem("name"))
            this.lastname = capitalize($window.localStorage.getItem("lastname"))
            let self = this
            // umumi borc
            orderService.getTotalBorc(function(data) {
                self.borc = data.borc
            }, function(statusCode) {
                // TODO DISPLAY ERROR unauthorized user
                self.show = "error"
            })
            // show order list
            this.show = "orderList"
            self.toOrderList = function() {
                self.show = "orderList" 
            }
            self.toOrderEdit = function() {
                self.show = "orderEdit"
                orderEditSwitch(self, orderService, vaqonService)
            }
            self.toVaqonEdit = function() {
                self.show = "vaqonEdit"
                vaqonEditSwitch(self, vaqonService)
            }
            

            orderService.getOrders(function(orders) {
                self.orders = orders
            }, function(status) {
                errorHandler(self, status)
            })
            // search
            this.search = function() {
                if(self.startDate && self.endDate) {
                    orderService.
                        getOrdersStartDateEndDate(dateToString(self.startDate)
                            , dateToString(self.endDate), function(orders) {
                            self.orders = orders
                        }, function(status) {
                            errorHandler(self, status)
                        })
                } else if(self.startDate) {
                    orderService.
                        getOrdersStartDate(dateToString(self.startDate), function(orders) {
                            self.orders = orders
                        }, function(status) {
                            errorHandler(self, status)
                        })
                }
            }
            this.reload = function() {
                orderService.getOrders(function(orders) {
                    self.orders = orders
                    self.startDate = null
                }, function(status) {
                    errorHandler(self, status)
                })
            }

            // logout
            this.logoutUser = function() {
                loginService.logout(function() {
                    $location.path('/login')
                })
            }
            // pay order
            this.payOrder = function(OrderId) {
                // DONT WORK, somekinda css error, not enough time :(
                // $mdDialog.show({
                //     controller: PayDialogController,
                //     templateUrl: 'order/payDialog.html',
                //     parent: angular.element(document.body),
                //     clickOutsideToClose: true
                // }).then(function (answer) {
                //     $scope.status = 'You said the information was "' + answer + '".';
                // }, function () {
                //     $scope.status = 'You cancelled the dialog.';
                // });
                orderService.
                    payOrder(OrderId, dateToString(new Date()), function() {
                        orderService.getOrders(function(orders) {
                            self.orders = orders
                        }, function(status) {
                            errorHandler(self, status)
                        })
                    }, function(status) {
                        console.log(`error status ${status}`)
                    })
            }

            function PayDialogController($scope, $mdDialog) {
                $scope.hide = function () {
                  $mdDialog.hide();
                };
            
                $scope.cancel = function () {
                  $mdDialog.cancel();
                };
              }
        }
    })

function orderEditSwitch(self, orderService, vaqonService) {
    vaqonService.getVaqonNoId(function(vaqons) {
        self.vaqonIds = vaqons.map(v => v.id)
    }, function(status) {
        errorHandler(self, status)
    })
    self.xidmets = ["gomrukleme", "mal_qebulu", "saxlanc"]
    self.vahids = ["AZN", "EUR", "RUB", "USD"]
    orderService.getOrders(function(orders) {
        self.orders = orders
    }, function(status) {
        errorHandler(self, status)
    })
    self.onCreateOrder = function() {
        const date = dateToString(new Date())
        orderService.createOrder(
            self.xidmet, self.vahid, self.miqdar,
            self.qiymet, date, self.vaqonNo,
            function() {
                orderService.getOrders(function(orders) {
                    self.orders = orders
                }, function(status) {
                    errorHandler(self, status)
                })
                vaqonService.getVaqonNoId(function(vaqons) {
                    self.vaqonIds = vaqons.map(v => v.id)
                }, function(status) {
                    errorHandler(self, status)
                })
            }, function(status) {
                errorHandler(self, status)
            }
        )
    }
    self.onDeleteOrder = function(orderId) {
        orderService.deleteOrder(orderId, function() {
            orderService.getOrders(function(orders) {
                self.orders = orders
            }, function(status) {
                errorHandler(self, status)
            })
        }, function(status) {
            errorHandler(self, status)
        })
    }
}

function dateToString(dt) {
    var mm = dt.getMonth() + 1; // getMonth() is zero-based
    var dd = dt.getDate();
  
    return [dt.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
}


function vaqonEditSwitch(self, vaqonService) {
    // load vaqons
    vaqonService.getVaqonMBnoOrderID(function(vaqons) {
        self.vaqons = vaqons
    }, function(status) {
        errorHandler(self, status)
    })

    self.onDeleteVaqon = function(vaqonId) {
        vaqonService.deleteVaqon(vaqonId, function() {
            vaqonService.getVaqonMBnoOrderID(function(vaqons) {
                self.vaqons = vaqons
            }, function(status) {
                errorHandler(self, status)
            })
        }, function(status) {
            errorHandler(self, status)
        })
    }

    self.vaqonEditShow = "mb"
    self.vaqonMBKTitleStyle = {
        "background-color": "#263439",
        "color": "#FFFFFF"
    }
    self.vaqonMBTitleStyle = {
        "background-color": "#000000",
        "color": "#FFFFFF"
    }
    self.onClickMb = function() { 
        self.vaqonEditShow = "mb" 
        self.vaqonMBKTitleStyle = {
            "background-color": "#263439",
            "color": "#FFFFFF"
        }
        self.vaqonMBTitleStyle = {
            "background-color": "#000000",
            "color": "#FFFFFF"
        }
        vaqonService.getVaqonMBnoOrderID(function(vaqons) {
            self.vaqons = vaqons
        }, function(status) {
            errorHandler(self, status)
        })
    }
    self.onClickMbk = function() { 
        self.vaqonEditShow = "mbk"
        self.vaqonMBKTitleStyle = {
            "background-color": "#000000",
            "color": "#FFFFFF"
        }
        self.vaqonMBTitleStyle = {
            "background-color": "#263439",
            "color": "#FFFFFF"
        }
        self.Types = ["itxal", "qisa_itxal"]
        self.onClickNewVaqonMBK = function() {
            vaqonService.createVaqonMBK(self.type, function(vaqons) {
                vaqonService.getVaqonMBKnoOrderID(function(vaqons) {
                    self.vaqonsMBK = vaqons
                }, function(status) {
                    errorHandler(self, status)
                })
            }, function(status) {
                errorHandler(self, status)
            })
        }
        vaqonService.getVaqonMBKnoOrderID(function(vaqons) {
            self.vaqonsMBK = vaqons
        }, function(status) {
            errorHandler(self, status)
        })
        self.onDeleteVaqonMBK = function(vaqonId) {
            vaqonService.deleteVaqon(vaqonId, function() {
                vaqonService.getVaqonMBKnoOrderID(function(vaqons) {
                    self.vaqonsMBK = vaqons
                }, function(status) {
                    errorHandler(self, status)
                })
            }, function(status) {
                errorHandler(self, status)
            })
        }
        
    }
    self.docTypes = ['qaime']
    self.onClickNewVaqon = function() {
        const fileName = document.getElementById('upload').files[0].name
        vaqonService.createVaqonMB(
            self.docType, self.file[0], fileName, function() {
                // reload vaqons
                vaqonService.getVaqonMBnoOrderID(function(vaqons) {
                    self.vaqons = vaqons
                }, function(status) {``
                    errorHandler(self, status)
                })
            }, function(status) {
                errorHandler(self, status)
            }
        )
    }
}

function errorHandler(self, errorStatus) {
    console.log(`error status ${errorStatus}`)
    if(errorStatus == 401)
        self.show = 401
    if(errorStatus == 403)
        self.show = 403
    if(errorStatus == 500)
        self.show = 500
}
