sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/p13n/Engine",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/p13n/FilterController",
    "sap/m/p13n/MetadataHelper",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/core/library",
    "sap/m/table/ColumnWidthController",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Fragment",

  ],
  function (
    Controller,
    JSONModel,
    Engine,
    SelectionController,
    SortController,
    GroupController,
    FilterController,
    MetadataHelper,
    Sorter,
    ColumnListItem,
    Text,
    coreLibrary,
    ColumnWidthController,
    Filter,
    MessageBox,
    Spreadsheet,
    exportLibrary,
    DateFormat,
    Fragment
  ) {
    "use strict";

    return Controller.extend(
      "zpro.sk.symbio.exim.sion.zsksymbioeximsionmaster.controller.View1",
      {
        onInit: function () {
          this.getOwnerComponent()
            .getRouter()
            .attachRoutePatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
          this._registerForP13n();
          this.getCallForTable([]);
          this.myProperties();
        },

        // Set properties
        myProperties: function () {
          var oProperties = {
            new: false,
            view: true,
            footer: false,
            edit: false,
            tableMode: "None",
            colView: true,
            colNew: false,
          };
          const oModelProperties = new JSONModel(oProperties);
          this.getView().setModel(oModelProperties, "myProperties");

          this.newEntry = true;
        },

        // Get call for Table entries
        getCallForTable: function (aFilters) {
          var sPath = "/ZC_SION_MASTER_HEAD";
          var callOptions = {};
          callOptions.filters = aFilters;

          callOptions.success = function (Data) {
            this.getView().setModel(new JSONModel(), "oModelForTable");
            this.getView().getModel("oModelForTable").setData(Data.results);
            var heading = "SION Master";
            if (Number(Data.results.length) > 0) {
              heading = "SION Master(" + Data.results.length + ")";
              this.getView().byId("title").setText(heading);
            } else {
              this.getView().byId("title").setText(heading);
            }
            this.getView().setBusy(false);
          }.bind(this);

          callOptions.error = function (sError) {
            this.getView().setBusy(false);
          }.bind(this);

          this.getView().setBusy(true);
          this.getOwnerComponent().getModel().read(sPath, callOptions);
        },

        // Excel Export
        onExport: function () {
          var aCols, oSettings;
          aCols = this.createColumnConfig();

          var sheetDetails =
            "SION Master(" +
            DateFormat.getDateTimeInstance({
              pattern: "MMM dd, yyyy hh:mm:ss",
            }).format(new Date()) +
            ")";

          var aData = this.getView().getModel('oModelForTable').getData();
          oSettings = {
            workbook: {
              columns: aCols,
              wrap: true,
              context: {
                application: "SION Master",
                title: sheetDetails,
                sheetName: "SION Master",
              },
            },
            dataSource: aData,
            fileName: sheetDetails,
          };

          var oSpreadsheet = new Spreadsheet(oSettings);
          oSpreadsheet.build().finally(function () {
            oSheet.destroy();
          });
        },
        createColumnConfig: function () {
          return [
            {
              label: "Material Number",
              property: "MaterialNumber",
            },
            {
              label: "Material Description ",
              property: "MaterialDescription ",
            },
            {
              label: "HSN Code",
              property: "HsnCode",
            },
            {
              label: "SION Number",
              property: "SionNo",
            },
            {
              label: "SION Description",
              property: "SionDesc",
            },
          ];
        },

        //Excel Upload 
        onUpload: function (oEvent) {
          this._import(
            oEvent.getParameter("files") && oEvent.getParameter("files")[0]
          );
        },
        _import: function (file) {
          var that = this;
          var excelData = {};

          if (file && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function (e) {
              var data = e.target.result;
              var workbook = XLSX.read(data, {
                type: "binary",
              });
              workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object for every sheet in workbook
                excelData = XLSX.utils.sheet_to_row_object_array(
                  workbook.Sheets[sheetName]
                );
              });

              var payload = { results: [] };

              for (var index = 0; index < excelData.length; index++) {
                var i = index.toString();
                var oTab = {};
                oTab.HsnCode = excelData[i].HSNCode;
                oTab.SionNo = excelData[i].SIONNumber;
                oTab.SionDesc = excelData[i].SIONDescription;
                payload.results.push(oTab);
              }

              that.getView().getModel('oModelForTable').setData(payload.results);
              that.getView().getModel('oModelForTable').refresh(true);
            };
          }
          reader.onerror = function (ex) {
            sap.m.MessageBox.error(
              "Uploaded excel format is wrong, Please check and reupload"
            );
          };
          reader.readAsBinaryString(file);
        },

        //Start: Button events
        // Add New items
        onAddNewButtonPress: function () {
          const oData = {
            results: [
              {
                HsnCode: "",
                SionNo: "",
                SionDesc: "",
              },
            ],
          };

          const oModel = new JSONModel(oData.results);
          this.getView().setModel(oModel, 'oModelForTable');
          var oModelProperties = this.getView().getModel("myProperties");
          oModelProperties.setProperty("/view", false);
          oModelProperties.setProperty("/new", true);
          oModelProperties.setProperty("/footer", true);
          oModelProperties.setProperty("/edit", false);
          oModelProperties.setProperty("/tableMode", "Delete");
          oModelProperties.setProperty("/colView", false);
          oModelProperties.setProperty("/colNew", true);
          this.newEntry = true;
        },
        // Edit the list
        onEditButtonPress: function () {
          var oModelProperties = this.getView().getModel("myProperties");
          oModelProperties.setProperty("/edit", true);
          oModelProperties.setProperty("/footer", true);
          oModelProperties.setProperty("/new", false);
          oModelProperties.setProperty("/tableMode", "Delete");
          oModelProperties.setProperty("/colView", false);
          oModelProperties.setProperty("/colNew", true);
          this.newEntry = false;
        },
        // Add single item
        onAddNewItemPress: function () {
          var JSONData = this.getView().getModel('oModelForTable').getData();

          var payloadForItem = {

            HsnCode: "",
            SionNo: "",
            SionDesc: "",
          };

          JSONData.push(payloadForItem);
          this.getView()
            .getModel('oModelForTable')
            .setData(JSON.parse(JSON.stringify(JSONData)));
        },
        // Delete single item
        onItemsTableDelete: function (oEvent) {
          var HSNCode = oEvent
            .getParameter("listItem")
            .getAggregation("cells")[5]
            .getValue();
          var SIONNumber = oEvent
            .getParameter("listItem")
            .getAggregation("cells")[6]
            .getValue();

          var JSONData = this.getView().getModel('oModelForTable').getData();
          if (this.newEntry) {
            if (JSONData.length > 1) {
              for (var i = 0; i < JSONData.length; i++) {
                if (
                  JSONData[i].SionNo === SIONNumber &&
                  JSONData[i].HsnCode === HSNCode
                ) {
                  var j = i;
                  i = JSONData.length;
                  sap.m.MessageBox.error(
                    "Delete entry " + HSNCode + ":" + SIONNumber + "?",
                    {
                      actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                      emphasizedAction: "Delete",
                      onClose: function (sAction) {
                        if (sAction === "Delete") {
                          JSONData.splice(j, 1);
                          this.getView()
                            .getModel('oModelForTable')
                            .setData(JSON.parse(JSON.stringify(JSONData)));
                        }
                      }.bind(this),
                    }
                  );
                }
              }
            } else {
              MessageBox.error("Atlease one entry is required");
            }
          } else {
            if (JSONData.length > 1) {
              for (var i = 0; i < JSONData.length; i++) {
                if (
                  JSONData[i].SionNo === SIONNumber &&
                  JSONData[i].HsnCode === HSNCode
                ) {
                  var j = i;
                  i = JSONData.length;
                  sap.m.MessageBox.error(
                    "Delete entry " + HSNCode + ":" + SIONNumber + "?",
                    {
                      actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                      emphasizedAction: "Delete",
                      onClose: function (sAction) {
                        if (sAction === "Delete") {
                          JSONData.splice(j, 1);
                          this.getView()
                            .getModel('oModelForTable')
                            .setData(JSON.parse(JSON.stringify(JSONData)));
                            var sPath = "/ZC_SION_MASTER_HEAD(HsnCode='" + HSNCode + "',SionNo='" + SIONNumber + "')";
                            var oModel = this.getOwnerComponent().getModel();
                            this.removeCall(oModel,sPath);
           
                        }
                      }.bind(this),
                    }
                  );
                }
              }
            }
          }
        },
        // On cancel button
        onCancelButtonPress: function (oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();


          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: oView.getId(),
              name: "zpro.sk.symbio.exim.sion.zsksymbioeximsionmaster.view.fragments.cancelConfirm",
              controller: this,
            }).then(function (oPopover) {
              oView.addDependent(oPopover);

              return oPopover;
            });
          }
          this._pPopover.then(function (oPopover) {
            oPopover.openBy(oButton);
          });
        },
        // cancel: Discard the changes
        onDiscard: function () {
          this.getCallForTable([]);
          var oModelProperties = this.getView().getModel("myProperties");
          oModelProperties.setProperty("/view", true);
          oModelProperties.setProperty("/new", false);
          oModelProperties.setProperty("/footer", false);
          oModelProperties.setProperty("/tableMode", "None");
          oModelProperties.setProperty("/edit", false);
          oModelProperties.setProperty("/colView", true);
          oModelProperties.setProperty("/colNew", false);
          this.newEntry = true;
        },
        // cancel: No to changes
        onDiscardNo: function (oEvent) {
          oEvent.getSource().getParent().getParent().close();
        },
        // Delete button - not used
        onDeleteButtonPress: function () {
          var oTable = this.getView().byId("SIONTable");
          var aSelectedPaths = oTable.getSelectedContextPaths();
          for (let index = 0; index < aSelectedPaths.length; index++) {
            const sPath = aSelectedPaths[index];
            const selectedContext = this.getView().getModel().getContext(sPath);
          }
        },
        // On Create
        onCreateButtonPress: function () {
          var oModel = this.getOwnerComponent().getModel();
          var sPath = '/ZC_SION_MASTER_HEAD'
          var payload = this.getView().getModel("oModelForTable").getData();
          this.setCurrentDateTime(payload);
          this.postCall(oModel, sPath, payload);
        },
        // On Save
        onSaveButtonPress: function () {
          var oModel = this.getOwnerComponent().getModel();
          var sPath = '/ZC_SION_MASTER_HEAD'
          var payload = this.getView().getModel("oModelForTable").getData();
          // this.updateCurrentDateTime(payload);
          this.mergeCall(oModel, sPath, payload);
        },
        //End: Button events

        // before post processing
        setCurrentDateTime: function (payload) {
          var currentDateTime = new Date();
          const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
          var currentTime = dt.format(new Date());

          for (let index = 0; index < payload.length; index++) {
            const element = payload[index];
            element.CreadtedDate = currentDateTime;
            element.ChangeDate = currentDateTime;
            element.CreatedTime = currentTime;
            element.ChangeTime = currentTime;
          }

        },
        validation: function (headerPayload) {
          // if (!headerPayload.BillEntry) {
          //     MessageBox.error("Please enter Bill of Entry");
          //     return false;
          // }

          // else {
          //     return true;
          // }
          return true;

        },

        // Post call
        postCall: function (oModel, sPath, aPayload) {

          var that = this;
          var promise = Promise.resolve();
          aPayload.forEach(function (Payload, i) { //copy local variables
            //Chain the promises
            promise = promise.then(function () { return that._promisecreateCallForEachItem(oModel, sPath, Payload) });
          });

          promise.then(function () {
            sap.m.MessageBox.success("SION Master entries created", {
              actions: [sap.m.MessageBox.Action.OK],
              emphasizedAction: "OK",
              onClose: function (sAction) {
                if (sAction === "OK") {
                  that.onDiscard()
                }
              }
            });
          })
            .catch(function () {

            })

        },
        _promisecreateCallForEachItem: function (oModel, sPath, Payload) {
          var that = this;
          // this.getView().setBusy(true);
          oModel.create(sPath, Payload, {
            success: function (oData, response) {
            }.bind(this),
            error: function (oError) {

              this.getView().setBusy(false);
            }.bind(this)
          });
        },

        //Merge call 
        mergeCall: function (oModel, sPath, aPayload) {

          var that = this;
          var promise = Promise.resolve();
          aPayload.forEach(function (Payload, i) { //copy local variables
            //Chain the promises
            promise = promise.then(function () {


              return that._promiseUpdateCallForEachItem(oModel, sPath, Payload)
            });
          });

          promise.then(function () {
            sap.m.MessageBox.success("SION Master entries updated", {
              actions: [sap.m.MessageBox.Action.OK],
              emphasizedAction: "OK",
              onClose: function (sAction) {
                if (sAction === "OK") {
                  that.onDiscard()
                }
              }
            });
          })
            .catch(function () {

            })

        },
        _promiseUpdateCallForEachItem: function (oModel, sPath, Payload) {
          sPath = sPath + "(HsnCode='" + Payload.HsnCode + "',SionNo='" + Payload.SionNo + "')";
          var that = this;
          // this.getView().setBusy(true);
          oModel.update(sPath, Payload, {
            success: function (oData, response) {
            }.bind(this),
            error: function (oError) {

              this.getView().setBusy(false);
            }.bind(this)
          });
        },

        // Remove call
        removeCall: function (oModel, sPath) {
          oModel.remove(sPath, {
            success: function (oData, response) {
            }.bind(this),
            error: function (oError) {

              this.getView().setBusy(false);
            }.bind(this)
          });
        },

        //Start: Menu options
        _registerForP13n: function () {
          const oTable = this.byId("SIONTable");

          this.oMetadataHelper = new MetadataHelper([
            // {
            //   key: "MaterialNumber",
            //   label: "Material Number",
            //   path: "MaterialNumber",
            // },
            // {
            //   key: "MaterialDescription",
            //   label: "Material Description",
            //   path: "MaterialDescription",
            // },
            {
              key: "HsnCode",
              label: "HSN Code",
              path: "HsnCode",
            },
            {
              key: "SionNo",
              label: "SION Number",
              path: "SionNo",
            },
            {
              key: "SionDesc",
              label: "SION Description",
              path: "SionDesc",
            },
          ]);

          Engine.getInstance().register(oTable, {
            helper: this.oMetadataHelper,
            controller: {
              Columns: new SelectionController({
                targetAggregation: "columns",
                control: oTable,
              }),
              Sorter: new SortController({
                control: oTable,
              }),
              Groups: new GroupController({
                control: oTable,
              }),
              ColumnWidth: new ColumnWidthController({
                control: oTable,
              }),
              Filter: new FilterController({
                control: oTable,
              }),
            },
          });

          Engine.getInstance().attachStateChange(
            this.handleStateChange.bind(this)
          );
        },

        openPersoDialog: function (oEvt) {
          this._openPersoDialog(
            ["Columns", "Sorter", "Groups", "Filter"],
            oEvt.getSource()
          );
        },

        _openPersoDialog: function (aPanels, oSource) {
          var oTable = this.byId("SIONTable");

          Engine.getInstance().show(oTable, aPanels, {
            contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
            contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
            source: oSource || oTable,
          });
        },

        _getKey: function (oControl) {
          return oControl.data("p13nKey");
        },

        handleStateChange: function (oEvt) {
          const oTable = this.byId("SIONTable");
          const oState = oEvt.getParameter("state");

          if (!oState) {
            return;
          }

          //Update the columns per selection in the state
          this.updateColumns(oState);

          //Create Filters & Sorters
          const aFilter = this.createFilters(oState);
          const aGroups = this.createGroups(oState);
          const aSorter = this.createSorters(oState, aGroups);

          const aCells = oState.Columns.map(
            function (oColumnState) {
              return new Text({
                text:
                  "{" +
                  this.oMetadataHelper.getProperty(oColumnState.key).path +
                  "}",
              });
            }.bind(this)
          );

          //rebind the table with the updated cell template
          oTable.bindItems({
            templateShareable: false,
            path: "/items",
            sorter: aSorter.concat(aGroups),
            filters: aFilter,
            template: new ColumnListItem({
              cells: aCells,
            }),
          });
        },

        createFilters: function (oState) {
          const aFilter = [];
          Object.keys(oState.Filter).forEach((sFilterKey) => {
            const filterPath =
              this.oMetadataHelper.getProperty(sFilterKey).path;

            oState.Filter[sFilterKey].forEach(function (oConditon) {
              aFilter.push(
                new Filter(filterPath, oConditon.operator, oConditon.values[0])
              );
            });
          });

          this.byId("filterInfo").setVisible(aFilter.length > 0);

          return aFilter;
        },

        createSorters: function (oState, aExistingSorter) {
          const aSorter = aExistingSorter || [];
          oState.Sorter.forEach(
            function (oSorter) {
              const oExistingSorter = aSorter.find(
                function (oSort) {
                  return (
                    oSort.sPath ===
                    this.oMetadataHelper.getProperty(oSorter.key).path
                  );
                }.bind(this)
              );

              if (oExistingSorter) {
                oExistingSorter.bDescending = !!oSorter.descending;
              } else {
                aSorter.push(
                  new Sorter(
                    this.oMetadataHelper.getProperty(oSorter.key).path,
                    oSorter.descending
                  )
                );
              }
            }.bind(this)
          );

          oState.Sorter.forEach((oSorter) => {
            const oCol = this.byId("SIONTable")
              .getColumns()
              .find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
            if (oSorter.sorted !== false) {
              oCol.setSortIndicator(
                oSorter.descending
                  ? coreLibrary.SortOrder.Descending
                  : coreLibrary.SortOrder.Ascending
              );
            }
          });

          return aSorter;
        },

        createGroups: function (oState) {
          const aGroupings = [];
          oState.Groups.forEach(
            function (oGroup) {
              aGroupings.push(
                new Sorter(
                  this.oMetadataHelper.getProperty(oGroup.key).path,
                  false,
                  true
                )
              );
            }.bind(this)
          );

          oState.Groups.forEach((oSorter) => {
            const oCol = this.byId("SIONTable")
              .getColumns()
              .find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
            oCol.data("grouped", true);
          });

          return aGroupings;
        },

        updateColumns: function (oState) {
          const oTable = this.byId("SIONTable");

          oTable.getColumns().forEach((oColumn, iIndex) => {
            oColumn.setVisible(false);
            oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
            oColumn.setSortIndicator(coreLibrary.SortOrder.None);
            oColumn.data("grouped", false);
          });

          oState.Columns.forEach((oProp, iIndex) => {
            const oCol = oTable
              .getColumns()
              .find((oColumn) => oColumn.data("p13nKey") === oProp.key);
            oCol.setVisible(true);

            oTable.removeColumn(oCol);
            oTable.insertColumn(oCol, iIndex);
          });
        },

        beforeOpenColumnMenu: function (oEvt) {
          const oMenu = this.byId("menu");
          const oColumn = oEvt.getParameter("openBy");
          const oSortItem = oMenu.getQuickActions()[0].getItems()[0];
          const oGroupItem = oMenu.getQuickActions()[1].getItems()[0];

          oSortItem.setKey(this._getKey(oColumn));
          oSortItem.setLabel(oColumn.getHeader().getText());
          oSortItem.setSortOrder(oColumn.getSortIndicator());

          oGroupItem.setKey(this._getKey(oColumn));
          oGroupItem.setLabel(oColumn.getHeader().getText());
          oGroupItem.setGrouped(oColumn.data("grouped"));
        },

        onColumnHeaderItemPress: function (oEvt) {
          const oColumnHeaderItem = oEvt.getSource();
          let sPanel = "Columns";
          if (oColumnHeaderItem.getIcon().indexOf("group") >= 0) {
            sPanel = "Groups";
          } else if (oColumnHeaderItem.getIcon().indexOf("sort") >= 0) {
            sPanel = "Sorter";
          } else if (oColumnHeaderItem.getIcon().indexOf("filter") >= 0) {
            sPanel = "Filter";
          }

          this._openPersoDialog([sPanel]);
        },

        onFilterInfoPress: function (oEvt) {
          this._openPersoDialog(["Filter"], oEvt.getSource());
        },

        onSort: function (oEvt) {
          const oSortItem = oEvt.getParameter("item");
          const oTable = this.byId("SIONTable");
          const sAffectedProperty = oSortItem.getKey();
          const sSortOrder = oSortItem.getSortOrder();

          //Apply the state programatically on sorting through the column menu
          //1) Retrieve the current personalization state
          Engine.getInstance()
            .retrieveState(oTable)
            .then(function (oState) {
              //2) Modify the existing personalization state --> clear all sorters before
              oState.Sorter.forEach(function (oSorter) {
                oSorter.sorted = false;
              });

              if (sSortOrder !== coreLibrary.SortOrder.None) {
                oState.Sorter.push({
                  key: sAffectedProperty,
                  descending: sSortOrder === coreLibrary.SortOrder.Descending,
                });
              }

              //3) Apply the modified personalization state to persist it in the VariantManagement
              Engine.getInstance().applyState(oTable, oState);
            });
        },

        onGroup: function (oEvt) {
          const oGroupItem = oEvt.getParameter("item");
          const oTable = this.byId("SIONTable");
          const sAffectedProperty = oGroupItem.getKey();

          //1) Retrieve the current personalization state
          Engine.getInstance()
            .retrieveState(oTable)
            .then(function (oState) {
              //2) Modify the existing personalization state --> clear all groupings before
              oState.Groups.forEach(function (oSorter) {
                oSorter.grouped = false;
              });

              if (oGroupItem.getGrouped()) {
                oState.Groups.push({
                  key: sAffectedProperty,
                });
              }

              //3) Apply the modified personalization state to persist it in the VariantManagement
              Engine.getInstance().applyState(oTable, oState);
            });
        },

        onColumnMove: function (oEvt) {
          const oDraggedColumn = oEvt.getParameter("draggedControl");
          const oDroppedColumn = oEvt.getParameter("droppedControl");

          if (oDraggedColumn === oDroppedColumn) {
            return;
          }

          const oTable = this.byId("SIONTable");
          const sDropPosition = oEvt.getParameter("dropPosition");
          const iDraggedIndex = oTable.indexOfColumn(oDraggedColumn);
          const iDroppedIndex = oTable.indexOfColumn(oDroppedColumn);
          const iNewPos =
            iDroppedIndex +
            (sDropPosition == "Before" ? 0 : 1) +
            (iDraggedIndex < iDroppedIndex ? -1 : 0);
          const sKey = this._getKey(oDraggedColumn);

          Engine.getInstance()
            .retrieveState(oTable)
            .then(function (oState) {
              const oCol = oState.Columns.find(function (oColumn) {
                return oColumn.key === sKey;
              }) || {
                key: sKey,
              };
              oCol.position = iNewPos;

              Engine.getInstance().applyState(oTable, {
                Columns: [oCol],
              });
            });
        },

        onColumnResize: function (oEvt) {
          const oColumn = oEvt.getParameter("column");
          const sWidth = oEvt.getParameter("width");
          const oTable = this.byId("SIONTable");

          const oColumnState = {};
          oColumnState[this._getKey(oColumn)] = sWidth;

          Engine.getInstance().applyState(oTable, {
            ColumnWidth: oColumnState,
          });
        },

        onClearFilterPress: function (oEvt) {
          const oTable = this.byId("SIONTable");
          Engine.getInstance()
            .retrieveState(oTable)
            .then(function (oState) {
              for (var sKey in oState.Filter) {
                oState.Filter[sKey].map((condition) => {
                  condition.filtered = false;
                });
              }
              Engine.getInstance().applyState(oTable, oState);
            });
        },

        onExit: function () {
          this.oModel = null;
          this.oSmartVariantManagement = null;
          this.oExpandedLabel = null;
          this.oSnappedLabel = null;
          this.oFilterBar = null;
          this.oTable = null;
        },

        fetchData: function () {
          var aData = this.oFilterBar
            .getAllFilterItems()
            .reduce(function (aResult, oFilterItem) {
              aResult.push({
                groupName: oFilterItem.getGroupName(),
                fieldName: oFilterItem.getName(),
                fieldData: oFilterItem.getControl().getSelectedKeys(),
              });

              return aResult;
            }, []);

          return aData;
        },

        applyData: function (aData) {
          aData.forEach(function (oDataObject) {
            var oControl = this.oFilterBar.determineControlByName(
              oDataObject.fieldName,
              oDataObject.groupName
            );
            oControl.setSelectedKeys(oDataObject.fieldData);
          }, this);
        },

        getFiltersWithValues: function () {
          var aFiltersWithValue = this.oFilterBar
            .getFilterGroupItems()
            .reduce(function (aResult, oFilterGroupItem) {
              var oControl = oFilterGroupItem.getControl();

              if (
                oControl &&
                oControl.getSelectedKeys &&
                oControl.getSelectedKeys().length > 0
              ) {
                aResult.push(oFilterGroupItem);
              }

              return aResult;
            }, []);

          return aFiltersWithValue;
        },

        onSelectionChange: function (oEvent) {
          this.oSmartVariantManagement.currentVariantSetModified(true);
          this.oFilterBar.fireFilterChange(oEvent);
        },

        onSearch: function () {
          var aTableFilters = this.oFilterBar
            .getFilterGroupItems()
            .reduce(function (aResult, oFilterGroupItem) {
              var oControl = oFilterGroupItem.getControl(),
                aSelectedKeys = oControl.getSelectedKeys(),
                aFilters = aSelectedKeys.map(function (sSelectedKey) {
                  return new Filter({
                    path: oFilterGroupItem.getName(),
                    operator: FilterOperator.Contains,
                    value1: sSelectedKey,
                  });
                });

              if (aSelectedKeys.length > 0) {
                aResult.push(
                  new Filter({
                    filters: aFilters,
                    and: false,
                  })
                );
              }

              return aResult;
            }, []);

          this.oTable.getBinding("items").filter(aTableFilters);
          this.oTable.setShowOverlay(false);
        },

        onFilterChange: function () {
          this._updateLabelsAndTable();
        },

        onAfterVariantLoad: function () {
          this._updateLabelsAndTable();
        },

        getFormattedSummaryText: function () {
          var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

          if (aFiltersWithValues.length === 0) {
            return "No filters active";
          }

          if (aFiltersWithValues.length === 1) {
            return (
              aFiltersWithValues.length +
              " filter active: " +
              aFiltersWithValues.join(", ")
            );
          }

          return (
            aFiltersWithValues.length +
            " filters active: " +
            aFiltersWithValues.join(", ")
          );
        },

        getFormattedSummaryTextExpanded: function () {
          var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

          if (aFiltersWithValues.length === 0) {
            return "No filters active";
          }

          var sText = aFiltersWithValues.length + " filters active",
            aNonVisibleFiltersWithValues =
              this.oFilterBar.retrieveNonVisibleFiltersWithValues();

          if (aFiltersWithValues.length === 1) {
            sText = aFiltersWithValues.length + " filter active";
          }

          if (
            aNonVisibleFiltersWithValues &&
            aNonVisibleFiltersWithValues.length > 0
          ) {
            sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
          }

          return sText;
        },

        _updateLabelsAndTable: function () {
          this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
          this.oSnappedLabel.setText(this.getFormattedSummaryText());
          this.oTable.setShowOverlay(true);
        },
        //End: Menu options
      }
    );
  }
);
