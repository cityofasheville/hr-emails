## Send Email to staff inviting them to fill out survey

Checks nightly for staff who are 7 days or 100 days after hire date.
Sends email with link to questionnare.

Can also be run with a parameter for the date:

    {
        "date_to_run": "2022-03-07"
    }

This will find staff 7 and 100 days before March 7, 2022


- If it doesn't successfully run, a CloudWatch alarm is sent for manual rerun.




Status: test emails all sent to me