function takePicture() {
    context.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
    var imageData = canvas.toDataURL('image/jpeg', 0.5);
    showCanvas()
    $("#imageData").val(imageData)
    $("#savePicture").show()
}

function resetCameraButtons(){
    $("#changePicture").hide();
    $("#cameraButton").show();
    $("#savePicture").hide();
}

function showCanvas() {

    videoPreview.style.display = 'none';
    canvas.style.display = 'block';
}

function showVideo() {
    videoPreview.style.display = 'block';
    canvas.style.display = 'none';
}

function hideVideoCanvas() {
    videoPreview.style.display = 'none';
    canvas.style.display = 'none';
}

function activateCamera(){
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (mediaStream) {
        $("#cameraButton").html('<i class="fa fa-camera"></i>')
        $("#cameraButton").show()
        stream = mediaStream;
        videoPreview.srcObject = mediaStream;
        videoPreview.play()
        showVideo()
    })
    .catch(function (error) {
        console.error('Error accessing camera:', error);
    });

    videoPreview.addEventListener('loadedmetadata', function() {
        var aspectRatio 
        if (videoPreview.videoWidth >videoPreview.videoHeight){
            aspectRatio = videoPreview.videoWidth / videoPreview.videoHeight;
        }
        else{
            aspectRatio =   videoPreview.videoHeight / videoPreview.videoWidth;

        }
        var canvasWidth = 160; // Set to your desired width
        var canvasHeight = canvasWidth / aspectRatio;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    });
}



function handleCameraCapture(){
    if (!stream || stream.active === false) {
        activateCamera()
    } else {
        $('#changePicture').show()
        $('#cameraButton').hide()
        takePicture();
    }
}
function changePicture(){
    showVideo()
    resetCameraButtons()
    $("#imageData").val('')
}

function savePicture() {
    
    closeCameraModal();
    sendData()
}


function closeStream(){
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());       
    }
    videoPreview.srcObject = null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    resetCameraButtons()
    hideVideoCanvas();
}

function sendData(){
    var payload = {
        "id" :rowData["תז"],
        "image" : $("#imageData").val()
    }
    console.log($("#imageData").val())
    
    $.ajax({

        url: "https://mllcr.info",
        type: 'POST',
        // context: Text,
        data: payload,
        cache: false,
        timeout: 60000,
        async: false,

        success: function (response) {
            //TODO: reload data
            console.log(response)
        },
        error: function (error) {
            //TODO :error handling
            console.log(error)
        },
    });

}

function closeCameraModal() {
    $("#cameraModal").css("display", "none");
    closeStream()
}


function openCameraModal() {

    $("#cameraModal").css("display", "block");
}