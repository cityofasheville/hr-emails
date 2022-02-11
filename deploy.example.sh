rm deploy.zip 2> /dev/null

# #For Windows, use 7z
# #7z a -r -tzip deploy.zip email.pug node_modules/*
zip -rq deploy.zip *.js email.pug node_modules/*

aws lambda delete-function --function-name hr-emails 2> /dev/null

aws lambda create-function --function-name hr-emails \
--description "hr-emails" \
--zip-file fileb://deploy.zip \
--role arn:aws:iam::518970837364:role/lambda-vpc-and-ses \
--tags "owner=ownername" \
--timeout 30 \
--environment Variables="{ \
host= \
database=, \
user=, \
password=, \
\
EMAIL_RECIPIENT_JSON='[\"name1@ashevillenc.gov\",\"name2@ashevillenc.gov\"]', \
\
EMAIL_SENDER=asheville_notifications@ashevillenc.gov \
}" \
--vpc-config SubnetIds=subnet-id,subnet-id2,SecurityGroupIds=sg-id \
--handler index.handler --runtime nodejs14.x
