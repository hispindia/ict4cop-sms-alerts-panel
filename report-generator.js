import outlierReport from './outlier-report';

function report(state){

    var dSListCommaSeparated = state.selectedDataSets.split(',').reduce((str,obj) => {        
        if (str == "") {
            str = "'"+obj+"'";
        }else{
            str = str + ",'"+obj +"'";            
        }
        
        return str;
    },"")

    var reportParams = {
        selectedOUUID : state.selectedOU.id,
        selectedOUName: state.selectedOU.name,
        selectedOULevel : state.selectedOU.level,
        selDate : state.startDate,      
        ptype : "Monthly",
        attributeOptionComboId : 15,
        dsUIDs : dSListCommaSeparated,
        reportName: "Outlier_"+ state.selectedOU.name + state.startDate
        
    }
    
    this.getReport = function(callback){

        new outlierReport(reportParams,
                          callback);
       
    }
    
}

module.exports = report;
