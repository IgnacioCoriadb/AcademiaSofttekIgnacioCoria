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
                let sClub = oEvent.getParameter('arguments').IdClub;
                // let sPath = `/ClubSet('${sClub}')`;
                // alert(sPath );
                let oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function(){
                    this.getView().bindElement({
                        path: `/ClubSet('${sClub}')`,
                        events: {
                            change: this._oBindingChange.bind(this),
                            dataRequested: function(){
                                that.getView().setBusy(true)
                            },
                            dataReceived: function(){
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

            //filtrar busqueda
            onSearchChangeFilterPlayers:function(oEvent){
                let dataSearch = oEvent.mParameters.newValue;
            
                this.searchInDatabase(dataSearch);
            },
            searchInDatabase: function(dataSearch) {
                console.log(dataSearch)
            },

          

        });


        
    });
