## Send Email to staff inviting them to fill out survey

Checks nightly for staff who are 7 days or 100 days after hire date.


Questions:
- If it doesn't successfully run, what happens?
    a) ignore^M^M^M^M^M^M
    a) CloudWatch alarms - manual rerun
    b) store successes somewhere and rerun tomorrow any since last good run
        last-good-run timestamp
        -----------------------
        2022-02-11 12:23:07

        select where startdate + 7 between last-good-run and today

