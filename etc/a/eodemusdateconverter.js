const greg_yearReg = [["jan",31],["feb",28],["mar",31],["apr",30],["may",31],["jun",30],["jul",31],["aug",31],["sep",30],["oct",31],["nov",30],["dec",31]];
const greg_yearLeap = [["jan",31],["feb",29],["mar",31],["apr",30],["may",31],["jun",30],["jul",31],["aug",31],["sep",30],["oct",31],["nov",30],["dec",31]];

const eod_yearReg = [["jan",35],["mar",35],["apr",35],["may",35],["jun",35],["jul",35],["aug",35],["oct",35],["nov",35],["dec",35],["eod",15]];
const eod_yearLeap = [["jan",35],["mar",35],["apr",35],["may",35],["jun",35],["jul",35],["aug",35],["oct",35],["nov",35],["dec",35],["eod",16]];

const month_numbers_greg = {"jan":1,"feb":2,"mar":3,"apr":4,"may":5,"jun":6,"jul":7,"aug":8,"sep":9,"oct":10,"nov":11,"dec":12};
const month_numbers_eod = {"jan":1,"mar":2,"apr":3,"may":4,"jun":5,"jul":6,"aug":7,"oct":8,"nov":9,"dec":10,"eod":11};

const month_alias = {"jan":"January","feb":"February","mar":"March","apr":"April","may":"May","jun":"June","jul":"July","aug":"August","sep":"September","oct":"October","nov":"November","dec":"December","eod":"Eodemus"};
const eod_days = ["Worms' Day","Fool's Day","Medicine Day","Mule's Day","Beggars' Day","Cousins' Day","Temperance Day","Plague Day","Satellite Day","The Day of Beasts", "The Day of Wheels","The Day of Numbers","Traitors' Day","Philosopher's Day","Children's Day","Thieves' Day"];

/*

functions for ext. use:
gregToEod(int month, int day, int year)
eodToGreg(int month, int day, int year)
isLeapYear(int year)

*/

function convertDate(in_month, in_day, in_year, eodToGreg = false) {
    let out_month, out_day;

    let is_leap = isLeapYear(in_year);
    let is_prev_year_leap = isLeapYear(in_year - 1);
    let is_next_year_leap = isLeapYear(in_year + 1);

    let year_shift = 0;
    let shift_by_days = eodToGreg ? 7 : -7;
    let noOfDaysInYear = is_leap ? 366 : 365;
    let noOfDaysPrevYear = is_prev_year_leap ? 366 : 365;
    let noOfDaysNextYear = is_next_year_leap ? 366 : 365;

    let greg_cal = is_leap ? greg_yearLeap : greg_yearReg;
    let eod_cal = is_leap ? eod_yearLeap : eod_yearReg;
    let input_cal = greg_cal; let output_cal = eod_cal;
    if (eodToGreg) {input_cal = eod_cal; output_cal = greg_cal;}

    let dayOfYear = 0;
    for (let i = 0; i < input_cal.length; i++) {
        if (in_month != input_cal[i][0]) { dayOfYear += input_cal[i][1]; continue; }
        dayOfYear += in_day;
        break;
    }

    dayOfYear += shift_by_days;
    if (dayOfYear <= 0) {
        dayOfYear += noOfDaysPrevYear;
        year_shift = -1;
    }
    else if (dayOfYear > noOfDaysInYear) {
        dayOfYear -= noOfDaysNextYear;
        year_shift = 1
    }
    let out_year = in_year + year_shift;

    if (isLeapYear(out_year) != isLeapYear(in_year)) {
        if (eodToGreg) {
            output_cal = isLeapYear(out_year) ? greg_yearLeap : greg_yearReg
        }
        else {
            output_cal = isLeapYear(out_year) ? eod_yearLeap : eod_yearReg
        }
    }

    let countDays = dayOfYear;
    for (let i = 0; i < output_cal.length; i++) {
        if (countDays > output_cal[i][1]) { countDays -= output_cal[i][1]; continue; }
        out_month = output_cal[i][0];
        out_day = countDays;
        break;
    }

    let output_date_type = eodToGreg ? "greg" : "eod";

    return {month:out_month, day:out_day, year:out_year, date_type:output_date_type};
}


function gregToEod(month, day, year) {
    return convertDate(month, day, year, false);
}


function eodToGreg(month, day, year) {
    return convertDate(month, day, year, true);
}


function dateToString(date, incl_eod_date_no=true) {
    let is_eod = date.month == "eod";
    let output = "";

    if (is_eod) {
        output += eod_days[date.day-1];
        if (incl_eod_date_no) {output += " (Eod " + date.day + ")";}
    }
    else { output += month_alias[date.month] + " " + date.day; }
    if (date.year > 0) { output += " " + date.year }

    return output;
}

function dateToStringCurt(date) {
    let month_no = date.date_type == "eod" ? month_numbers_eod[date.month] : month_numbers_greg[date.month];
    let output = "" + month_no + "/" + date.day;
    if (date.year > 0) { output += "/" + date.year; }
    return output;
}


function isLeapYear(year) {
    return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0);
}
