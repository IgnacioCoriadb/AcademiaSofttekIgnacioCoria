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

        return BaseController.extend("com.sofftek.aca20241q.controller.Main", {
            onInit: function () {
                that = this;   
                var oButton = this.getView().byId("buttonCreate");
                oButton.setEnabled(false);
            },

           
            onExit: function () {

            },

            onBeforeRendering: function () {
                //el that para poder hacer la consulta de manera global
                that.oModel = this.getView().getModel("academiaJSONModel");
            },

           

            onAfterRendering: function () {
               
            },

          /*******************NAVBAR*********************** */
          onPressGoToMaster: function(oEvent){
            var oListItem = oEvent.getSource();
            var sListItemId = oListItem.getId();
         
            // Obtener solo el ID del elemento sin el prefijo
            var aIdParts = sListItemId.split("--");
            var sItemId = aIdParts[aIdParts.length - 1];


            switch(sItemId){
                case "_IdClubes":
                    this.getSplitContObj().toMaster(this.createId("listClubes"));
                    break;
                case "_IdPlayers":
                    this.getSplitContObj().toMaster(this.createId("listPlayers"));
                    break
            }              
        },

        getSplitContObj: function () {
			var result = this.byId("SplitContDemo");
			if (!result) {
				Log.error("SplitApp object can't be found");
			}
			return result;
		},

        onPressMasterBack: function () {
			this.getSplitContObj().backMaster();
		},
        onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitContObj().toDetail(this.createId(sToPageId));
			
		},
        /**********************************FIN NAVBAR*****************************************/

    

        /*************CRUD CLUBES***********************/

        validateInputCreateClub:function(){
        
            let name = this.getView().byId("name").getValue();
            let city = this.getView().byId("city").getValue();
            let country = this.getView().byId("country").getValue();
            let league = this.getView().byId("league").getValue();
            var oDatePicker = this.getView().byId("foundationDate").getDateValue();
           
            //convertir la fecha a el formato de la base de datos
            var dateObj = new Date(oDatePicker);
            var year = dateObj.getFullYear();
            var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
            var day = ("0" + dateObj.getDate()).slice(-2);
            var formattedDate = year + "-" + month + "-" + day + "T00:00:00";            

            // Validar que los campos no estén vacíos
            if (!name || !city || !country || !league || !oDatePicker) {
                sap.m.MessageToast.show("Por favor, complete todos los campos.");
             
                return; // Detener la función si algún campo está vacío
            }else{
                // Convertir la fecha a el formato de la base de datos
                var dateObj = new Date(oDatePicker);
                var year = dateObj.getFullYear();
                var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
                var day = ("0" + dateObj.getDate()).slice(-2);
                var formattedDate = year + "-" + month + "-" + day + "T00:00:00";
    
                var data = {
                    Name: name,
                    City: city,
                    Country: country,
                    League: league,
                    FoundationDate: formattedDate
                };
                var oButton = this.getView().byId("buttonCreate");
                oButton.setEnabled(true);
    
                return data;
            }


          
        },


        createClub:function(){
            let oDataModel = this.getOwnerComponent().getModel();
            let dataValidated =this.validateInputCreateClub();

            if(dataValidated){
                oDataModel.create("/ClubSet", dataValidated, {
                    success: function(oResponse) {
                        sap.m.MessageToast.show("Club creado correctamente");
                        // refrescar el modelo para actualizar la tabla después de la creación
                        that.getOwnerComponent().getModel().refresh(true, true);
                    },
                    error: function(oError) {
                        sap.m.MessageToast.show("No se pudo crear el club");
                    }
                });
            }else{
                alert("todos los campos son obligatorios")
            }
          
        },



        modalEditClub: function(){
            //abrir Modal
            if (!this.oCreateFragment) {
                this.oCreateFragment =
                    sap.ui.core.Fragment.load({
                        name: "com.sofftek.aca20241q.view.fragments.DialogEditClub",
                        controller: that
                    }).then(function (oDialog) {
                        that.getView().addDependent(oDialog);
                        let oModel = new sap.ui.model.json.JSONModel({
                            "Nombre": "",
                            "Puntuacion": ""
                        })
                        oModel.setDefaultBindingMode("TwoWay");
                        oDialog.setModel(oModel, "ClubEdit");
                        oDialog.attachAfterClose(that._afterCloseDialog);
                        return oDialog;
                    }.bind(that));
            }
            that.oCreateFragment.then(function (oDialog) {
                oDialog.open();
            }.bind(that));
        },

        editClub: function(){
            //llamar a la funcion para abrir modal
            that.modalEditClub();
          
            
            
            
            
            
            // alert("Funcion editar club")
            //obtengo el id para pegarle al back , me retorna /ClubSet('006')
            let idClub = oEvent.getSource().getBindingContext().getPath();

            let oDataModel = this.getOwnerComponent().getModel();
            oDataModel.update(`/${idClub}`, data, {
                success: function(oResponse) {
                    sap.m.MessageToast.show("Club editado correctamente");
                    // refrescar el modelo para actualizar la tabla después de editar
                    that.getOwnerComponent().getModel().refresh(true, true);
                },
                error: function(oError) {
                    sap.m.MessageToast.show("No se pudo editar el club");
                }
            });
            

        },


        deleteClub: function(oEvent){
            //obtengo el id para pegarle al back , me retorna /ClubSet('006')
            let idClub = oEvent.getSource().getBindingContext().getPath();

            let oDataModel = this.getOwnerComponent().getModel();
            oDataModel.remove(`${idClub}`,{
                success : function(oResponse){
                    sap.m.MessageBox.success("Club eliminado correctamente");
                    //refrescar el modelo para que se actualice la tabla despues de eliminar
                    that.getOwnerComponent().getModel().refresh(true,true);
                },
                error: function(oError){
                    sap.m.MessageBox.success("No se pudo eliminar el club");
                }
            })
        },


        /***************FIN CRUD********************* */

        /*************Filtros en all clubes****************************/
        onSearchChangeFilter:function(oEvent){
            let dataSearch = oEvent.mParameters.newValue;

            this.searchInDatabase(dataSearch);
        },
        searchInDatabase: function(dataSearch) {
            console.log(dataSearch)
        },
        /*************************************************************/


        /***********obtener jugadores del club********************* */

        getPlayersClub:function(oEvent){
            let idClub = oEvent.getSource().getBindingContext().getProperty('IdClub');

            this.getRouter().navTo("Detail", {
                IdClub: idClub
            });
        }


        /********************************************************* */

        });


        
    });
