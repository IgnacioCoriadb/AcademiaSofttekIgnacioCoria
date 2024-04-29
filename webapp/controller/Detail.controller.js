sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MesaageToast) {
        "use strict";
        var that;

        return BaseController.extend("com.sofftek.aca20241q.controller.Detail", {
            onInit: function () {
                that = this;
                let oRouter = this.getRouter();
                oRouter.getRoute('Detail').attachPatternMatched(this._onPatternMatched, this);
            },

            _onPatternMatched:function(oEvent){
                let sClub = oEvent.getParameter('arguments').idClub;

                let oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function(){
                    this.getView().bindElement({
                        path: `/ClubSet('${sClub}')`,
                        events: {
                            change: this._oBindingChange.bind(this),
                            dataRequested: function(){
                                that.getView().setBusy(true)
                            },
                            dataRecived: function(){
                                that.getView().setBusy(false)
    
                            }
                        }
                    })
                }.bind(this));
     
            
            },

            _oBindingChange: function(oEvent){
               
            },

            onExit: function () {

            },

            onBeforeRendering: function () {
                
            },

            onAfterRendering: function () {

            },

      

        });
    });
