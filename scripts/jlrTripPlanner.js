function addLeg() {
  // add a new row to the leg table

  // get the hidden row used as a template
  hRow = document.getElementById('blank-row');
  // copy the hidden node, remove the id and append it to the table body
  newRow = hRow.cloneNode(true);
  newRow.removeAttribute('id');
  legTableBody = hRow.parentElement;
  legTableBody.insertBefore(newRow, hRow);
  // make the new row visible
  newRow.removeAttribute('hidden');
}

function updatePrediction() {
  // update the predicted % used and Arrival %

  // first get the value the user just typed
  curValue = getNumValue(event.target);
  // then gather necessary components of the formula
  rangePerPct = getNumValue(document.getElementById('range-per-percent'));
  currSOC = getNumValue(document.getElementById('curr-batt'));

  pctUsed = event.target.parentElement.querySelector('.pct-used');
  var pctUsedByLeg = curValue / rangePerPct;
  pctUsed.textContent = pctUsedByLeg;
  arrivPct = event.target.parentElement.querySelector('.arriv-pct');
  arrivPct.textContent = currSOC - pctUsedByLeg;
}

function getNumValue(elm) {
  return parseFloat(elm.textContent);
}

function getSheet(name) {
  var Activesheet = SpreadsheetApp.getActive();
  return Activesheet.getSheetByName(name);
}

function SearchForKey(dictary, key) {
  var retval = null;
  dictary.forEach(function(item){
    if(item.key == key) {
    Logger.log(item.key + ': ' + item.value)    
      retval = item.value;
      return retval;
    }
  });
  return retval
}

function ClearTrip() {
  var Trip = getSheet("Trip");
  Trip.getRange('AllLegs').clear({contentsOnly: true});
  Trip.getRange('AllLegs').setBackground('#ffffff');
  Trip.getRange('AllCharges').clear({contentsOnly: true});
  Trip.getRange('AllCharges').setBackground('#ffffff');
  Trip.getRange('Actuals').clear({contentsOnly: true});
  Trip.getRange('UpdtCharge').clear({contentsOnly: true});
  Trip.getRange('UpdtOdometer').clear({contentsOnly: true});
  Trip.getRange('StCharge').clear({contentsOnly: true});
  Trip.getRange('StOdometer').clear({contentsOnly: true});
  for (var i = 1; i <= 9; i++) {
    Trip.getRange("Done_C").offset(i, 0).setValue(0);
    }  
  Trip.getRange('A5').activate();
}

function NextCar() {
  var Parms = getSheet("Parms");
//  Logger.log(Parms.getSheetName())
  Parms.getRange('Car').setValue(Parms.getRange('Car').getValue() + 1);
//  Logger.log(Parms.getRange('Car').offset(0, Parms.getRange('Car').getValue()).getValue());
  if (Parms.getRange('Car').offset(0, Parms.getRange('Car').getValue()).isBlank()) {
    Parms.getRange('Car').setValue(1);
  }   
}

function GetMileageNCharge() {
  var status=getVehStatus();
  // Logger.log (status)
  var Parms = getSheet("Parms");
  Parms.getRange('CurrOdometer').setValue(SearchForKey(status.vehicleStatus, 'ODOMETER_MILES'));
  Parms.getRange('CurrCharge').setValue(SearchForKey(status.vehicleStatus, 'EV_STATE_OF_CHARGE'));
}

function uuidv4() {
  var results = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  // Logger.log(results);
  return results;
}

function MyUUID() {
  var Parms = getSheet("Parms")
  if (Parms.getRange('MyUUID').isBlank()) {
    Parms.getRange('MyUUID').setValue(uuidv4());
  };
  return Parms.getRange('MyUUID').getValue();
}

function JLRConnect (){
  // Create a connection to the JLR service
  var Parms = getSheet("Parms")
  Parms.getRange("ConnInfo").clearContent();
  var payload = {
    'grant_type': 'password',
    'username': Parms.getRange("EmailID").getValue(),
    'password': Parms.getRange("Password").getValue(),
  };
  
  var header = {'Authorization' : 'Basic YXM6YXNwYXNz',
    'Content-Type': 'application/json',
      'X-Device-Id': MyUUID()};
  
  var options = {
    'method' : 'POST',
    'headers': header,
    'payload' : JSON.stringify(payload),
    'muteHttpExceptions' : true
  };
  var results = JSON.parse(UrlFetchApp.fetch('https://ifas.prod-row.jlrmotor.com/ifas/jlr/tokens', options));
  
  // store returned values in the spreadsheet
  Parms.getRange('access_token').setValue(results.access_token);
  Parms.getRange('authorization_token').setValue(results.authorization_token);
  Parms.getRange('expires_in').setValue(results.expires_in);
  Parms.getRange('refresh_token').setValue(results.refresh_token);
  Parms.getRange('token_type').setValue(results.token_type);
  
  // Register the device
  JLRRegisterDevice();
  // Log in
  JLRloginUser();
  
  if (Parms.getRange("VIN").isBlank()) {
    var info = getVehicle()
    Parms.getRange("VIN").setValue(info.vehicles[0].vin);
  }
};

function defaultHeader() {
  var Parms = getSheet("Parms")
  header = {
    'Authorization': 'Bearer ' +  Parms.getRange('access_token').getValue(),
    'X-Device-Id' : MyUUID(),
    'Content-Type' : 'application/json'};
  return header;
};

function JLRRegisterDevice(){
  
  var Parms = getSheet("Parms")
  
  var header = {
    'X-Device-Id' : MyUUID(),
    'Content-Type' : 'application/json'};
  var payload = {
    'access_token': Parms.getRange('access_token').getValue(),
    'authorization_token': Parms.getRange('authorization_token').getValue(),
    'expires_in': Parms.getRange('expires_in').getValue(),
    'deviceID': MyUUID()
  }
  var options = {
    'method' : 'POST',
    'headers': header,
    'payload': JSON.stringify(payload),
    'muteHttpExceptions' : true
  }
  var results = UrlFetchApp.fetch('https://ifop.prod-row.jlrmotor.com/ifop/jlr/users/' + Parms.getRange("EmailID").getValue() + '/clients', options);

 // Logger.log(results);
 // Logger.log('After Register')
}

function JLRloginUser(){
  Logger.log('Starting Login.')
  var Parms = getSheet("Parms")
  var header = {
    'Authorization': 'Bearer ' +  Parms.getRange('access_token').getValue(),
    'Accept' : 'application/vnd.wirelesscar.ngtp.if9.User-v3+json',
    'X-Device-Id' : MyUUID(),
    'Content-Type' : 'application/json',
    'Connection' : 'close'};
  var options = {
    'method' : 'GET',
    'headers': header,
    'muteHttpExceptions' : true
  }
  var results = JSON.parse(UrlFetchApp.fetch('https://if9.prod-row.jlrmotor.com/if9/jlr/users?loginName=' + Parms.getRange("EmailID").getValue(), options));
  // Logger.log('Login: ');
  //Logger.log(results);
  if (Parms.getRange("JLRID").isBlank()) {
    Parms.getRange("JLRID").setValue(results.userId);
  }
}

function getVehStatus(){
  var Parms = getSheet("Parms")
  
  var header = {
    'Authorization': 'Bearer ' +  Parms.getRange('access_token').getValue(),
    'Accept' : 'application/vnd.ngtp.org.if9.healthstatus-v2+json',
    'X-Device-Id' : MyUUID(),
    'Content-Type' : 'application/json'};
  
  var options = {
    'method' : 'GET',
    'headers': header,
    'muteHttpExceptions' : true
  }
  var results = UrlFetchApp.fetch('https://if9.prod-row.jlrmotor.com/if9/jlr/vehicles/' + Parms.getRange("VIN").getValue() + '/status', options);
  // Logger.log('Status: ' + results);
  return JSON.parse(results);
}
function getVehicle(){
  var Parms = getSheet("Parms")
  header = {
    'Authorization': 'Bearer ' +  Parms.getRange('access_token').getValue(),
    'X-Device-Id' : MyUUID(),
    'Content-Type' : 'application/json'};
  
  var options = {
    'method' : 'GET',
    'headers': header,
    'muteHttpExceptions' : true
  }
  var results = UrlFetchApp.fetch('https://if9.prod-row.jlrmotor.com/if9/jlr/users/'+ Parms.getRange("JLRID").getValue() + '/vehicles?primaryOnly=true', options);
  Logger.log('Veh: ' + results);
  return JSON.parse(results);
}

function StartTrip() {
  JLRConnect();
  GetMileageNCharge();
  var Parms = getSheet("Parms");
  var Trip = getSheet("Trip");
  Trip.getRange('StOdometer').setValue(Parms.getRange('CurrOdometer').getValue());
  Trip.getRange('StCharge').setValue(Parms.getRange('CurrCharge').getValue());
  Trip.getRange('UpdtOdometer').setValue(Trip.getRange('StOdometer').getValue());
  Trip.getRange('UpdtCharge').setValue(Trip.getRange('StCharge').getValue());
}

function UpdCurrMileage(updt=true) {
  if (updt) {
    GetMileageNCharge();
  }  
  var Parms = getSheet("Parms");
  var Trip = getSheet("Trip");
  if (Parms.getRange("CurrCharge") <= Trip.getRange("StCharge")) {
    Trip.getRange('UpdtOdometer').setValue(Parms.getRange('CurrOdometer').getValue());
    Trip.getRange('UpdtCharge').setValue(Parms.getRange('CurrCharge').getValue());
  }
}

function LastDoneOffset() {
  var Trip = getSheet("Trip");
  var i = 0
  do {
    i++;
  }while (Trip.getRange("Done_C").offset(i,0).getValue() == 1);
  return i - 1
}

function CompleteLeg() {
  var Trip = getSheet("Trip");
  UpdCurrMileage()
  var i = LastDoneOffset() + 1
  Trip.getRange("Done_C").offset(i,0).setValue(1)
  Trip.getRange("Done_C").offset(i,1).setValue(Trip.getRange("UpdtCharge").getValue())
}

function IJustCharged() {
  var Trip = getSheet("Trip");
  UpdCurrMileage();
  var i = LastDoneOffset();
  Trip.getRange("ChgTo_C").offset(i, 0).setValue(Trip.getRange("UpdtCharge").getValue());
  Trip.getRange("AmtChgd_C").offset(i,0).setValue(Trip.getRange("ChgTo_C").offset(i,0).getValue() - Trip.getRange("AmtChgd_C").offset(i,-1).getValue());
}