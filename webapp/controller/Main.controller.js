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
            },

           
            onExit: function () {

            },

            onBeforeRendering: function () {
                //el that para poder hacer la consulta de manera global
                that.oModel = this.getView().getModel("academiaJSONModel");
            },

            onSelectionItem: function(oEvent) {
               let oTable = oEvent.getSource();
               let oSelected = oTable.getSelectedItem();
               let sClub = oSelected.getBindingContext().getProperty("IdClub");
               this.getRouter().navTo('Detail', {IdClub: sClub});
            },
            
            

          

           

            onAfterRendering: function () {
                
            },

          /**********NAVBAR*********************** */
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
			// debugger
		},
        /********************************** */


        //formatear fecha
        getFoundationDate: function(date) {
            
            if (!date) {
                return "";
            }
            // Convertir la fecha a un objeto Date si no lo es
            if (!(date instanceof Date)) {
                date = new Date(date);
               alert(date)
            }

            // Obtener el día, mes y año de la fecha
            const dia = date.getDate();
            const mes = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
            const anio = date.getFullYear();

            // Formatear la fecha como "dd/mm/aaaa"
            return `${dia}/${mes}/${anio}`;
        },
    

        /*************CRUD***********************/
        editClub: function(){
            alert("Funcion editar club")
        },
        deleteClub: function(){
            alert("Funcion eliminar club")
        }




        /************************************ */

        });


        
    });
