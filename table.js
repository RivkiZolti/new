function renderImageOrButton(data) {
    if (data) {
        return '<img src="' + data + '" class="image-popup" alt="Image" width="25" height="25">'

    } else {
        return '<button class="cameraButton"><i class="fas fa-camera"></i></button>';
    }
}

function initializeDataTable(tableId, data) {
    var keys = Object.keys(data[0]);
    keys.unshift("Select"); 
    var table = $('#' + tableId).DataTable({
        scrollY: '500px',
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        columnDefs: [
            {
                orderable: false,
                className: 'select-checkbox',
                targets:   0
            },
            {
                orderable: false,
                targets:   1
            },
        ],
        select: {
            style:    'multi',
            selector: 'td:first-child'
        },
        order: [],
        responsive: true,
        data: data,
        columns: [
            { data: null, defaultContent: '<input type="checkbox" class="select-row">' },
            {
                data: 'תמונה',
                render: renderImageOrButton
            },
            { data: 'שם' },
            { data: 'משפחה' },
            { data: 'תז' },
            { data: 'סוג זיהוי' },
            { data: 'מדינה' },
            { data: 'סוג לימוד' },
            { data: 'תאריך לידה' },
            { data: 'תאריך קליטה' },
            { data: 'שם קבוצה' },
            { data: 'שם קבוצה צהריים' },
            { data: 'טלפון' },
            { data: 'טלפון אשה' },
            { data: 'טלפון בית' },
            { data: 'מייל' },
            { data: 'נשוי/רווק' },
            { data: 'שם מוסד מלא' },
            { data: 'כתובת הסניף' },
            { data: 'מספר סניף' },
            { data: 'גיל' },
            { data: 'כתובת התלמיד' },
            { data: 'כתובת הקבוצה' },
            { data: 'שם ביהמד של הקבוצה' },
            { data: 'מייל אחראי' },
            { data: 'שם ראש הקבוצה' },
            { data: 'מייל ראש הקבוצה' },
            { data: "שם הבנק" },
            { data: "מספר סניף" },
            { data: "מספר חשבון" },
        ],
        language: {
            "search": '' ,
            "searchPlaceholder": " 🔍 חפש בכל הטבלה ",
            "lengthMenu": 'הצג _MENU_ רשומות' ,
            "paginate": {
                "next":       "הבא",
                "previous":   "קודם"
            },
            "info": "מציג _START_ עד _END_ מתוך _TOTAL_",
            "infoFiltered":"(מסונן מ _MAX_ רשומות)"
        },

        
    });

    return table


}

