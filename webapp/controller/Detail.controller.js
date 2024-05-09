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
                this.dataPlayer();

            },


       
            dataPlayer: function(){
                this._oModel = new sap.ui.model.json.JSONModel({
                    "Name": "",
                    "City": "",
                    "Country": "",
                    "League": "",
                    "FoundationDate": ""
                });
                this.getView().setModel(this._oModel, "FormDataPlayer");
               },
            _onPatternMatched: function(oEvent) {
                let sClub = oEvent.getParameter('arguments').IdClub;
                console.log(sClub);
            
                let oModel = this.getOwnerComponent().getModel();
            
                oModel.metadataLoaded().then(function() {
                    oModel.read(`/ClubSet('${sClub}')/ToPlayerSet`, {
                        success: function(oResponse) {
                            // Crear un nuevo modelo JSON y establecer los datos de los jugadores
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData(oResponse.results);
            
                            // Guardar el modelo en una propiedad del controlador para acceder a él más tarde
                            this._playerModel = oJSONModel;
                            this.getView().setModel(oJSONModel, "PlayerModel");
            
            
                        }.bind(this),
                        error: function(oError) {
                            // Manejar errores si es necesario
                        }
                    });
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
                
                var oBinding = oList.getBinding("items");
                console.log(dataSearch)
            },

            deletePlayer:function(oEvent){
                let idPlayer = oEvent.getSource().getBindingContext().getPath();
                let oDataModel = this.getOwnerComponent().getModel();
                oDataModel.remove(`${idPlayer}`,{
                    success : function(oResponse){
                        sap.m.MessageBox.success("Jugador eliminado correctamente");
                        //refrescar el modelo para que se actualice la tabla despues de eliminar
                        that.getOwnerComponent().getModel().refresh(true,true);
                    },
                    error: function(oError){
                        sap.m.MessageBox.success("No se pudo eliminar el jugador");
                    }
                })
            },
         
            openDialogUpdate: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("PlayerModel");
                var oPlayer = oContext.getObject();
            
                // Obtener valores de los campos al momento de abrir el diálogo
                var sName = oPlayer.Name;
                var sLastName = oPlayer.LastName;
                var sNationality = oPlayer.Nationality;
                var sSelectedClubKey = oPlayer.IdClub;
                var oDate = oPlayer.BirthDate;
            
                if (!this.oCreateFragment) {
                    this.oCreateFragment =
                        sap.ui.core.Fragment.load({
                            name: "com.sofftek.aca20241q.view.fragments.DialogPlayers",
                            controller: this // Asegúrate de que el controlador esté disponible aquí
                        }).then(function (oDialog) {
                            this.getView().addDependent(oDialog);
            
                            // Establecer valores en el modelo del diálogo
                            var oModel = new sap.ui.model.json.JSONModel({
                                "Name": sName,
                                "LastName": sLastName,
                                "BirthDate": oDate,
                                "Nationality": sNationality,
                                "IdClub": sSelectedClubKey,
                                "IdPlayer": oPlayer.IdPlayer
                            });
                            oModel.setDefaultBindingMode("TwoWay");
                            oDialog.setModel(oModel, "PlayerUpdate");
            
                            oDialog.attachAfterClose(this._afterCloseDialog);
            
                            return oDialog;
                        }.bind(this));
                }
            
                this.oCreateFragment.then(function (oDialog) {
                    oDialog.open();
                });
            },
            

            updatePlayer:function(oEvent){
                var oModel = this.getView().getModel("FormDataPlayer").getData();
                var oDialog = oEvent.getSource();
    
                // Obtener el modelo del diálogo
                var oDialogModel = oDialog.getModel("PlayerUpdate");
            
                // Obtener los nuevos valores del modelo
                var sNewName = oDialogModel.getProperty("/Name");
                var sNewLastName = oDialogModel.getProperty("/LastName");
                var sNewNationality = oDialogModel.getProperty("/Nationality");
                var sNewSelectedClubKey = oDialogModel.getProperty("/IdClub");
                var oNewDate = oDialogModel.getProperty("/BirthDate");


                let idPlayer=oDialogModel.getData().IdPlayer;
                let idClub =oDialogModel.getData().IdClub;
              
                let url = `/PlayerSet(IdPlayer='${idPlayer}',IdClub='${idClub}')`;
                
                // let data = oModel.getData();
                let oDataModel = this.getOwnerComponent().getModel();
                // let birthDate= oModel.BirthDate;
              
                //convertir la fecha a el formato de la base de datos
                var dateObj = new Date(oNewDate);
                var year = dateObj.getFullYear();
                var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
                var day = ("0" + dateObj.getDate()).slice(-2);
                var formattedDate = year + "-" + month + "-" + day + "T00:00:00";         
            
               
                // oModel.setProperty("/FoundationDate", formattedDate);
           
                let data = {
                    "Name": sNewName,
                    "LastName": sNewLastName,
                    "BirthDate" :  formattedDate,
                    "Nationality":sNewNationality,
                    "IdClub" : sNewSelectedClubKey,
                }
              
                oDataModel.update(url, data, {
                    success: function(oResponse) {
                        sap.m.MessageToast.show("Jugador editado correctamente");
                        // refrescar el modelo para actualizar la tabla después de editar
                        that.getOwnerComponent().getModel().refresh(true, true);
                        that.closeDialogPlayer();
                        
                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageToast.show("No se pudo editar el club");
                    }
                });

                
             },

             _afterCloseDialog: function(oEvent){
                oEvent.getSource().destroy();
                that.oCreateFragment = null;
             },
       

    

             closeDialogPlayer:function(){
                that.oCreateFragment.then(function (oDialog) {
                    oDialog.close();
                }.bind(that));
               
             },
    

             onSearchChangeFilterPlayers: function(oEvent) {
                var sValue = oEvent.getParameter("newValue");
                
                // Crear un filtro para los campos relevantes
                var oFilter = new sap.ui.model.Filter([
                    new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("Nationality", sap.ui.model.FilterOperator.Contains, sValue)
                ], false);
            
                // Obtener la referencia al modelo de datos
                var oModel = this.getView().getModel("PlayerModel");
            
                // Obtener los bindings del modelo
                var aBindings = oModel.aBindings;
            
                // Aplicar el filtro a cada binding
                aBindings.forEach(function(oBinding) {
                    oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
                });
            }
            
            
            
          
        });


        
    });
