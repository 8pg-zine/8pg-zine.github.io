var dropZone = document.getElementById('dropZone');
var imgCount = 0;
var imgList = [];

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) {
        if (file.type.match(/image.*/)) {
            var reader = new FileReader();

            reader.onload = function(e2) {
                // finished reading file data.
                var imgDiv = document.createElement('li');
                var img = document.createElement('img');
                var label = document.createElement('div');
                label.innerHTML = ++imgCount;
                label.className = "page-number";
                img.src = e2.target.result;
                img.className += " preview-img greyscale";
                imgDiv.appendChild(img);
                imgDiv.className += " preview-img-container";
                var previewDiv = document.getElementById('sortable');
                previewDiv.appendChild(imgDiv);
                imgDiv.appendChild(label);
            }

            reader.readAsDataURL(file); // start reading the file data.
        }
    }
});

/*
$( "#sortable" ).sortable({
    sort: function( event, ui ) {}
  });
*/

// reorder page numbers when reordering pages
$( "#sortable" ).on( "sortstop", function( event, ui ) {
    console.log("sortstop event fired!");
    var items = document.getElementById("sortable");
    for (let i=0; i<items.children.length; i++) {
        console.log(items.children[i]);
        console.log(items.children[i].getElementsByClassName("page-number")[0]);
        items.children[i].getElementsByClassName("page-number")[0].innerHTML = i+1;
    }
} );

// takes an element containing an image and applies a class to it called 'flip'.
// 
function flip(el) {
    el.className += " flip";
}

function print() {
    document.getElementById("setup").className += " hidden";
    document.getElementById("print-top").classList.remove("hidden");
    document.getElementById("print-bottom").classList.remove("hidden");
    var items = document.getElementById("sortable");
    var targetTop = document.getElementById("print-top");
    var targetBottom = document.getElementById("print-bottom");
    var reordered = [];

    // hardcoding this for an 8 page document.  We'll need a better way later.
    reordered[0] = items.children[6];
    reordered[1] = items.children[5];
    reordered[2] = items.children[4];
    reordered[3] = items.children[3];
    reordered[4] = items.children[7];
    reordered[5] = items.children[0];
    reordered[6] = items.children[1];
    reordered[7] = items.children[2];

    for (let i=0; i<reordered.length; i++) {
        console.log(reordered[i]);
        var el = document.createElement('img');
        var previewImg = reordered[i].getElementsByClassName("preview-img")[0];
        el.src = previewImg.src;
        // this should probably be replaced by something else eventually
        el.id = `print-${i}`;

        // pages 4-7 should be flipped
        if (i <= 3) {
            el.className += " print-img-top";
            el.className += " flip";
            targetTop.appendChild(el);
        }
        else {
            el.className += " print-img-bottom";
            targetBottom.appendChild(el);
        }

    }

}