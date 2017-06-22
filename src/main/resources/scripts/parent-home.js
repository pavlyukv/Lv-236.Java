$(function() {
    var pupilId = 0;
    var pupilFormId = 0;
    var selectedDate = new Date();
    var monday = getMonday(selectedDate);
    var minYear = selectedDate.getFullYear();
    var maxYear = selectedDate.getFullYear();
    var lang = $("#locale").val();

    if (selectedDate.getMonth() < 9 - 1) {
        minYear -= 1;
    } else {
        maxYear += 1;
    }

    $.datepicker.setDefaults($.datepicker.regional[lang]);

    $("#datepicker").datepicker({
        dateFormat: "dd.mm.yy",
        minDate: new Date(minYear, 9 - 1, 1),
        maxDate: new Date(maxYear, 8 - 1, 31)
        // showButtonPanel: true
        // defaultDate: selectedDate
    });

    $("#datepicker").change(function() {
        selectedDate = $(this).datepicker("getDate");
        var newMonday = getMonday(selectedDate);

        if (monday.getTime() === newMonday.getTime()) {
            return;
        }
        monday = newMonday;
        loadSchedule();
    });

    $("#pupil-select a").click(function () {
        pupilFormId = $(this).data("pupil-form-id");
        pupilId = $(this).data("pupil-id");

        // alert(pupilFormId + " " + pupilId);
        loadSchedule();
        loadLessons();
    });

    $("#pupil-select a:last").trigger("click");

    function getMonday(date) {
        var newDate = new Date(date);
        var day = newDate.getDay();
        var diff = newDate.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(newDate.setDate(diff));
    }

    function addDays(date, days) {
        var newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    }

    function loadSchedule() {
        var searchParams = {
            pupilFormId: pupilFormId,
            date: selectedDate
        };
        $.ajax({
            url : "/freemarker/parent-home/schedule",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify(searchParams),
            success : function (response) {
                var daysInWeek = 7;

                for(var i = 1; i <= daysInWeek; i++) {
                    $('#day' + i + ' thead tr th').eq(0).text($.datepicker.formatDate('DD, dd.mm.yy', addDays(monday, i - 1)));
                }

                $(".for-clear").empty();
                $.each(response, function(i, schedule) {
                    var dayOfWeek = new Date(schedule.date).getDay();
                    var selector = $('#day' + dayOfWeek + ' tbody tr').eq(schedule.lessonPosition);

                    selector.prop("title", schedule.homework);
                    selector.find("td").eq(1).text(schedule.lessonName);
                    selector.find("td").eq(2).text(schedule.classroomName);
                    selector.find("td").eq(3).text(schedule.teacherFirstName + " " + schedule.teacherLastName);
                });
            }
        });
    }

    function loadLessons() {
        var searchParams = {
            pupilFormId: pupilFormId
        };
        $.ajax({
            url : "/freemarker/parent-home/lessons",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify(searchParams),
            success : function (response) {
                $("#lessons").empty();
                $.each(response, function(i, lesson) {
                    $("#lessons").append($("<option></option>").attr("value", lesson.id).text(lesson.name));
                });
                loadAttendance();
            }
        });
    }

    $("#lessons").change(function() {
        loadAttendance();
    });

    function loadAttendance() {
        var searchParams = {
            pupilId: pupilId,
            lessonId: $("#lessons").val()
        };
        $.ajax({
            url : "/freemarker/parent-home/attendance",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify(searchParams),
            success : function (response) {
                $("#attendanceData tbody").empty();
                $.each(response, function(i, attendance) {
                    $('#attendanceData tbody').append('<tr><td>' + $.datepicker.formatDate('DD, dd.mm.yy', new Date(attendance.date)) + '</td><td>' + attendance.grade + '</td></tr>');
                });
            }
        });
    }

});
