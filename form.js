function getSelectedRows(table) {

    SelectedRows = [];
    table.rows('.selected', { search: 'applied' }).data().each(function (data) {
        SelectedRows.push(data);
    });
}

function createcampaign(table,data){
    getSelectedRows(table)
    if (SelectedRows.length >0){
        parseName()
        table.destroy()
        $('#studentTable').hide()
        $('#createcampaign').hide()
        $('#chooseSystem').show() 
    }else{
        alert("חובה לבחור לפחות תלמיד אחד מהרשימה")
    }
}

function getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1);
    if (dd.length === 1) {
        dd = '0' + dd;
    }
    if (mm.length === 1) {
        mm = '0' + mm;
    }
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today
}


function parseName(){
    var groupsName={}
    $.each(SelectedRows, function (_, user) {
        if (user["שם מוסד מלא"] in groupsName){
            
            if ($.inArray(user["שם קבוצה"], groupsName[user["שם מוסד מלא"]]) === -1){
                groupsName[user["שם מוסד מלא"]].push(user["שם קבוצה"])
            }

        }else{
            groupsName[user["שם מוסד מלא"]] = []
            groupsName[user["שם מוסד מלא"]].push(user["שם קבוצה"])
        }

    });
    var today = getCurrentDate()
    var nameData = today +":"
    var len
    var lastKey = Object.keys(groupsName)
    lastKey =lastKey[lastKey.length - 1]
    for (group in groupsName){
        len = groupsName[group].length
        nameData += group + ":" 
        for (index in groupsName[group]){
            nameData+= groupsName[group][index]

            if (index  < (len -1)){
                nameData += "|"
            }
        }
        if (group !== lastKey){
            nameData += ","
        }
        
    }
    nameData = nameData.slice(0, 127);
   $("#defaultText").text(nameData);
   $("#name").val($("#defaultText").text());

} 


function getCallerIds(){
    var payload = {
        'token': token
    };

    $.ajax({
        url: base_url + 'GetCustomerData',
        type: 'POST',
        data: payload,
        cache: false,
        timeout: 60000,
        async: false,

        success: function(response) {
            if (response.responseStatus !== 'OK') {
                console.error("get callerids failed. Server response: " + (response.message || "Unknown error"));
                Swal.fire({
                    title: 'Error',
                    text: 'שגיאה בקבלת אמצעי זיהוי',
                    icon: 'error',
                });
                return false
            }

            var caller_ids = [response.mainDid];

            $.each(response.secondary_dids, function(index, did) {
                caller_ids.push(did.did);
            });

            $.each(response.callerIds, function(index, caller_id) {
                caller_ids.push(caller_id.callerId);
            });

            var selectElement = document.getElementById("caller_id");

            caller_ids.forEach(function(caller_id) {
            var option = document.createElement("option");
                option.value = caller_id;
                option.text = caller_id;
                selectElement.add(option);
            });
        },
        error: function( error) {
            console.error("get callerids failed reason : ", error);
            Swal.fire({
                    title: 'Error',
                    text: 'שגיאה בקבלת אמצעי זיהוי',
                    icon: 'error',
                });
            return false

        }
    });
}

function login(username, password) {
    var payload = {
        'username': username,
        'password': password
    };


    $.ajax({
        url: base_url + 'Login',
        type: 'POST',
        data: payload,
        cache: false,
        timeout: 60000,
        async: false,

        success: function (response) {
            if (response.responseStatus !== 'OK') {
                Swal.fire({
                    title: 'Error!',
                    text: 'שם המשתמש או הסיסמא שגויים',
                    icon: 'error',
                });
                $('#reset').show()

               
            } else{
                token =  username+ ":" + password
                $('#chooseSystem').hide() 
                $('#myForm').show()
            }
        },
        error: function (error) {
            console.error("login failed reason : ", error);
            Swal.fire({
                title: 'Error!',
                text: 'שם המשתמש או הסיסמא שגויים',
                icon: 'error',
            });
        },
    });

}

function getPhonesInfo(){
    var fields = $("#myList").find('li').map(function() {
        return $(this).text();
    }).get();
    var data="phone,name,moreinfo\n"
    var moreInfo = ""
    if (fields.length > 0) {
        for ( user in SelectedRows){
            moreInfo = ""
            fields.forEach(function(field) {
                moreInfo += field + ":" + SelectedRows[user][field] + " "

            });
            
            data += SelectedRows[user]["טלפון"] + "," + SelectedRows[user]["שם"] +  "," + moreInfo + "\n"
        }
    }
    return data
}

async function createTemplate() {
    try {
        var payload = {
            'token': token,
            "description": $("#name").val()
        };

        const response = await fetch("https://www.call2all.co.il/ym/api/CreateTemplate", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var responseData = await response.json();

        if (responseData.responseStatus !== 'OK') {
            console.error("Template creation failed. Server response: " + (responseData.message || "Unknown error"));
            Swal.fire({
                title: 'Error!',
                text: 'שגיאה ביצירת תבנית לקמפיין',
                icon: 'error',
            });
            return false;
        } else {
            templateId = responseData.templateId;
            return await uploadFile();
        }
    } catch (error) {
        console.error("Template creation failed. Reason: " + error);
        Swal.fire({
            title: 'Error!',
            text: 'שגיאה ביצירת תבנית לקמפיין',
            icon: 'error',
        });
        return false;
    }
}

async function uploadFile() {
    try {
        var fileInput = $('#audioFile')[0];
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        formData.append('path', templateId + '.wav');
        formData.append('convertAudio', 1);

        var response = await fetch(base_url + 'UploadFile', {
            method: 'POST',
            body: formData,
        });

        var responseData = await response.json();

        if (responseData.responseStatus !== 'OK') {
            console.error("File upload failed. Server response: " + (responseData.message || "Unknown error"));
            Swal.fire({
                title: 'Error!',
                text: 'שגיאה בהעלאת הקובץ',
                icon: 'error',
            });
            return false;
        } else {
            return await uploadPhoneList();
        }
    } catch (error) {
        console.error('File upload failed:', error);
        Swal.fire({
            title: 'Error!',
            text: 'שגיאה בהעלאת הקובץ',
            icon: 'error',
        });
        return false;
    }
}

async function uploadPhoneList() {
    try {
        var phones = getPhonesInfo()
        var data = {
            "token": token,
            "templateId": templateId,
            "data": phones
        };

        var response = await fetch(base_url + 'UploadPhoneList', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var responseData = await response.json();

        if (responseData.responseStatus !== "OK") {
            console.error("Uploading phone list failed. Server response: " + (responseData.message || "Unknown error"));
            Swal.fire({
                title: 'Error',
                text: 'שגיאה בהעלאת מספרי פלאפון',
                icon: 'error',
            });
            return false;
        } else {
            return await runCampaign();
        }
    } catch (error) {
        console.error("Uploading phone list failed. Reason: " + error);
        Swal.fire({
            title: 'Error',
            text: 'שגיאה בהעלאת מספרי פלאפון',
            icon: 'error',
        });
        return false;
    }
}

async function runCampaign() {
    try {
        var payload = {
            'token': token,
            'templateId': templateId,
            'callerId': $("#caller_id option:selected").val()
        };

        var response = await fetch(base_url + 'RunCampaign', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var responseData = await response.json();

        if (responseData.responseStatus !== "OK") {
            console.error("RunCampaign failed. Server response: " + (responseData.message || "Unknown error"));
            Swal.fire({
                title: 'Error!',
                text: 'שגיאה בהרצת הקמפיין',
                icon: 'error',
            });
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error("RunCampaign failed. Reason: " + error);
        Swal.fire({
            title: 'Error!',
            text: 'שגיאה בהרצת הקמפיין',
            icon: 'error',
        });
        return false;
    }
}
function showLoadingIndicator() {
    // Show loading overlay
    $('#loading-overlay').css('display', 'flex');
}

function hideLoadingIndicator() {
    // Hide loading overlay
    $('#loading-overlay').css('display', 'none');
}

