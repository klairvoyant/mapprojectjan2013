/**
* Created at www.klairvoyant.in jjjjjjjjjjjjjjjj
* User: john
* Date: 8/28/12
* Time: 11:13 AM
*
*/

var varDis;
var fileType;  // is the file extention (i.e. tcx)
var unitId;   //from <unitId>
var Id; // from <Id>
var tempActivity;
var Activity; //from <Activity Sport="Biking"> (in this case the variable value will be Biking)
var startLat; // from the first <LatitudeDegrees> field
var startLng;// from the first <LongitudeDegrees> field
var endLat; //from the last <LatitudeDegrees> field in the entire file
var endLng; //from the last < LongitudeDegrees > field in the entire file
var len,len2;
var lapNumber;// from the number of <Lap codes in the file


/*





var lapStartTime;
var lapStartDate;// split out from <Lap StartTime="2012-09-25T00:32:50Z"> - two strings
var lapDuration;// from <TotalTimeSeconds> in seconds
var lapDistance;// from <DistanceMetres> /1000 to make km
var lapMaxSpeed;// from <MaximumSpeed> *3.6 to make km/hr
var lapCalories;// from <Calories>
var lapAveHR; //from <AverageHeartRateBpm>
var lapMaxHR;// from <MaximumHeartRateBpm>
var lapAveCadence;// from the average of all <Cadence> values in each lap (i.e. average of all values in item 22f, below, including zeros)
var lapMaxCadence;// from <MaxBikeCadence>
var lapAvePower;// from <ns3:AvgWatts>128</ns3:AvgWatts> in the <Extensions> at the end of each <Lap
var lapMaxPower;// from <ns3:MaxWatts>128</ns3:MaxWatts> in the <Extensions> at the end of each <Lap

var lapDetails;// are taken from the data within the <Track> marks and is stored (as a multidimensional array) in the format (x, y, z, duration, distance, cadence, HR, power) with the following meanings:
var totalDistance;// is the last ‘distance’ value in the last lap, or the sum of the lapDistance values (kilometres)
var totalDuration;// is the sum of the lapDuration values (seconds)
var maxSpeed;// is the highest lapMaxSpeed value (km/h)
var aveSpeed;// is totalDistance / totalDuration / 3600 (km/h)
var totalCalories;// is the sum of the lapCalories values
var maxHR;// is the highest lapMaxHR value
var aveHR;// is the average of all values in HRdataStr (below) (ignore zeros in average)
var maxCadence; *//*is the highest lapMaxCadance value*//*
var aveCadence; *//*is the average of all values in cadencedataStr (below) (include zeros in average)*//*
var maxPower;// is the highest lapMaxPower value
var avePower;// is the average of all values in powerdataStr (below) (include zeros in average)
//var elevdataStr;// is the x,y,z from each of the lapDetails arrays (format as a string of x,y,z x,y,z x,y,z)
var HRdataStr;// – a string built up from the HeartRateBpm values, such as "120,125,130,140,150,155,160,185,0,0,185,185,190,175,170,165,130,120" built up from the HR tags (item 22g above) within all the lapDetails arrays (note the 0 means no data was collected for that point)
//var cadencedataStr;// – a string built up from the Cadence tags (item 22f above), comma separated built up from the data within all the lapDetails arrays
//var powerdataStr;// – built up from the Watts tag (item 22h above), comma separated built up from the data within all the lapDetails arrays



var inputs, n, m,temp,lapHR=[];
var lapCadence;*/

var content=new String("");
var dataFile=['walk_courses.tcx','activity-goals-fr405.TCX'];  // for checking already uploaded  files. it should be in database temporarily stored in a array
function load()
{
   var  display = new Garmin.DeviceDisplay("garminDisplay",
        {
///                        pathKeyPairsArray: ["http://developer.garmin.com/","ee3934433a35ee348583236c2eeadbc1"],
            unlockOnPageLoad: true,
            showStatusElement: true,
            autoFindDevices: true,
            findDevicesButtonText: "Search for Devices",
            showCancelFindDevicesButton: false,
            autoWriteData: false,
            activityDirectoryCheckAllTooltip: "select all",//jj
            activityDirectoryHeaderStatus: false,//jj
            autoReadData: true,
            showReadDataElement: true,
            uploadSelectedActivities: true,
            showReadTracksSelect: true,
            useDeviceBrowser: false,
            postActivityHandler: function(aFile, aDisplay){ postFile(aFile, aDisplay);},
            statusCellProcessingImg: '<img src="../img/spinner.gif" width="15" height="15" />', //change default path for loading img
            readDataType: Garmin.DeviceControl.FILE_TYPES.readableDir,
            fileListingOptions:	[
                {dataTypeName: 'GPSData',dataTypeID: 'http://www.topografix.com/GPX/1/1', computeMD5: false},
                {dataTypeName: 'FitnessHistory', dataTypeID: 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2',computeMD5: false}
                               ]
        });

}

function postFile(aFile, aDisplay)
{
    var pass=false;
    var theStatusCell = aDisplay.currentActivityStatusElement();
    content="";
    var theContent = $('outputDiv').innerHTML;
    var myfileType;

    if( theContent.length == 0 )
    {
        theContent = '<strong>Succesfully Read  File(s):</strong>';
    }
    //aFile is a UUEncoded file, not just the string!
    var wholetext = aFile.split('\n');
    var n=wholetext[0].lastIndexOf(" ");
    var nam=wholetext[0].slice(n);
    nam=nam.replace(/^\s+|\s+$/g, '') ;// for replace spaces
    var parts=nam.split(".");


    // to check the file type
    switch( parts[1])
    {
        case   "gpx":
         myfileType=1;
          break;
        case   "tcx":
          myfileType=2;
          break;
        default:
           myfileType=0;

    }


    // checking the file aganist the databas( here the temporary array)
    for(var j=0;j<dataFile.length;j++)
    {
        if(nam==dataFile[j])
        {
            pass=true;
        }

    }

      if(pass==true)        // true means files already uploaded
        {
            theStatusCell.innerHTML = 'Exists';
        }
        else if(pass==false)
        {
            for(var i = 1; i < wholetext.length-1; i++){
                content = content.concat( wholetext[i] ); // fetching and storing the entire file in the variable content
            }
            var theLines = decode64(content); // decoding the contents and stored in the variable theLines

            readXML(theLines,myfileType );// function to fetch a particular node data from the file. which fetched, decoded and stored in the variable "theLines"

            if( theStatusCell ) {
                theStatusCell.innerHTML = 'Done';

            }


        }

    if( aDisplay.activityQueue.size() == 1)
    {
        //this is the last file (it will be popped off the queue after we're called).
        //In a production environment, if you define your own postActivityHandler, you'd have your own XHR callbacks
        //to determine when to finalize the DeviceDisplay status. Here, we'll pretend the uploads were instantaneous.
        aDisplay.setStatus('The Selected Binary file reads are complete!');
    }

}

function decode64(input) {

    var keyStr = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

    var output = "";

    var chr1, chr2, chr3 = "";

    var enc1, enc2, enc3, enc4 = "";

    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =

    var base64test = /[^A-Za-z0-9\+\/\=]/g;

    if (base64test.exec(input)) {

        alert("There were invalid base64 characters in the input text.\n" +

        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +

        "Expect errors in decoding.");

    }

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {

        enc1 = keyStr.indexOf(input.charAt(i++));

        enc2 = keyStr.indexOf(input.charAt(i++));

        enc3 = keyStr.indexOf(input.charAt(i++));

        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);

        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {

            output = output + String.fromCharCode(chr2);

        }

        if (enc4 != 64) {

            output = output + String.fromCharCode(chr3);

        }

        chr1 = chr2 = chr3 = "";

        enc1 = enc2 = enc3 = enc4 = "";



    } while (i < input.length);


    return decodeURI(output);

}





function getValues(){
    alert("afer 5 seconds");

    fileType="tcx";
//    varDis=" 1) File Type= "+fileType;
    unitId=xmlDoc.getElementsByTagName("UnitId")[0].childNodes[0].nodeValue;
//    varDis+= " 2) Unit ID= "+ unitId;
    Id=xmlDoc.getElementsByTagName("Id")[0].childNodes[0].nodeValue;
//    varDis+= " 3) ID= "+ Id;
    tempActivity=xmlDoc.getElementsByTagName("Activity");
    Activity=tempActivity[0].getAttribute("Sport");
//    varDis+= " 4) Activity= "+ Activity;
    startLat=xmlDoc.getElementsByTagName("LatitudeDegrees")[0].childNodes[0].nodeValue;
//    varDis+= " 5) Starting Latitude= "+ startLat;
    startLng=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;
//    varDis+= " 6) Starting Longitude= "+ startLng;
    endLat=xmlDoc.getElementsByTagName("LatitudeDegrees")[len-1].childNodes[0].nodeValue;
    endLng=xmlDoc.getElementsByTagName("LongitudeDegrees")[len-1].childNodes[0].nodeValue;
   // varDis+= " 9) No of Laps= "+ lapNumber;

    //     ------------------------  passed ----------------------------

    for(var i=0; i<lapNumber.length; i++) {

    }



    $('forDisplayVariables').innerHTML=varDis;




    /*







     for(var i=0; i<inputs.length; i++) {
     lapStartTime[i]= inputs[i].childNodes[0].Attributes["StartTime"].value;
     //lapStartDate=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     lapDuration[i]=inputs[i].getElementsByTagName("TotalTimeSeconds")[0].childNodes[0].nodeValue;
     lapDistance[i]=inputs[i].getElementsByTagName("DistanceMeters")[0].childNodes[0].nodeValue;
     lapDistance[i]=(lapDistance[i]/1000);
     lapMaxSpeed[i]=inputs[i].getElementsByTagName("MaximumSpeed")[0].childNodes[0].nodeValue;
     lapMaxSpeed[i]=lapMaxSpeed[i]*3.6;
     lapCalories[i]=inputs[i].getElementsByTagName("Calories")[0].childNodes[0].nodeValue;
     n=inputs[i].getElementsByTagName("AverageHeartRateBpm");
     lapAveHR[i]=n.getElementsByTagName("Value")[0].childNodes[0].nodeValue;
     m=inputs[i].getElementsByTagName("MaximumHeartRateBpm");
     lapMaxHR[i]=m.getElementsByTagName("Value")[0].childNodes[0].nodeValue;
     lapCadence[i]=inputs[i].getElementsByTagName("Cadence")[0].childNodes[0].nodeValue;
     lapMaxCadence[i]=inputs[i].getElementsByTagName("MaxBikeCadence")[0].childNodes[0].nodeValue;
     lapAvePower[i]=inputs[i].getElementsByTagName("AvgWatts")[0].childNodes[0].nodeValue;
     lapMaxPower[i]=inputs[i].getElementsByTagName("MaxWatts")[0].childNodes[0].nodeValue;
     n=inputs[i].getElementsByTagName("Track");
     lapDetails[i][x]=n.getElementsByTagName("LongitudeDegrees");
     lapDetails[i][y]=n.getElementsByTagName("LatitudeDegrees");
     lapDetails[i][z]=n.getElementsByTagName("AltitudeMeters");

     lapDetails[i][time]=n.getElementsByTagName("Time");
     lapDetails[i][duration][0]=0;
     for(var i2=1; i2<lapDetails[i][time].length; i2++) {

     lapDetails[i][duration][i2]=(lapDetails[i][time][i2] - lapDetails[i][time][0]);

     }
     lapDetails[i][distance]=n.getElementsByTagName("DistanceMeters");
     lapDetails[i][cadence]=n.getElementsByTagName("Cadence");
     lapDetails[i][HR]=n.getElementsByTagName("HeartRateBpm");
     lapDetails[i][Power]=n.getElementsByTagName("ns3:Watts");

     maxHR[i]=lapMaxHR[i][0];

     for(var j=0; j<lapMaxHR[i].length; j++)
     {

     if(lapMaxHR[i][j]>maxHR[i])
     {
     maxHR[i]=lapMaxHR[i][j];
     }
     }

     maxSpeed[i]=lapMaxSpeed[i][0];

     for(var j=0; j<lapMaxSpeed[i].length; j++)
     {
     if(lapMaxSpeed[i][j]>maxSpeed[i])
     {
     maxSpeed[i]=lapMaxSpeed[i][j];
     }

     }

     maxCadence[i]=lapCadence[i][0];

     for(var j=0; j<lapCadence[i].length; j++)
     {
     if(lapCadence[i][j]>maxCadence[i])
     {
     maxCadence[i]=lapCadence[i][j];
     }
     lapAveCadence[i]+=lapCadence[i][j];

     }

     lapAveCadence[i]=lapAveCadence[i]/lapCadence[i].length;


     }// lap loop

     for(var i=0; i<lapNumber; i++)
     {

     totalDuration+=lapDuration[i];
     totalCalories+=lapCalories[i];

     }



     totalDistance=lapDetails[lapNumber][distance][(lapDetails[lapNumber][distance]).length];

     aveSpeed= totalDistance / totalDuration / 3600;
     aveHR=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO


     aveCadence=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     maxPower=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     avePower=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     elevdataStr=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     HRdataStr=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     cadencedataStr=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO
     powerdataStr=xmlDoc.getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue;//TODO









     da+=xmlDoc.getElementsByTagName("TotalTimeSeconds")[0].childNodes[0].nodeValue;

     jk= xmlDoc.getElementsByTagName("BeginPosition");
     da+=" Begin Point"
     da+=jk[0].getElementsByTagName("LatitudeDegrees")[0].childNodes[0].nodeValue
     da+=" - ";
     da+=jk[0].getElementsByTagName("LongitudeDegrees")[0].childNodes[0].nodeValue
     document.getElementById('outputDiv').innerHTML =da*/


}



function readXML(aFile,myfileType) {
    var da;
    if (window.DOMParser)
  {
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(aFile,"text/xml");
      }
    else // Internet Explorer
  {
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async=false;
      xmlDoc.loadXML(aFile);
      }

    if(myfileType==0)
    {
        Alert("unsupported file format");
    }
    else if(myfileType==1)
    {
       //gpx file



    }
    else if(myfileType==2)
    {
    // tcx file
        len2  = xmlDoc.getElementsByTagName("LatitudeDegrees");
        len=len2.length
        lapNumber = xmlDoc.getElementsByTagName('Lap').length;
        setTimeout(getValues, 8000);
    }

}


