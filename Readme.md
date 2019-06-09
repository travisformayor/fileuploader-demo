# File Upload Example Notes

A code along with <https://www.youtube.com/watch?v=b6Oe2puTdMQ>

Plus some extras

- Different message types
- File size limit
- Only supported file types
- Rename file to its md5 hash
- Save to s3 (not done yet)

Creating bucket and file in s3 is following this guide:

- <https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html>
- <https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html>

IAM user only has permission to put files into one bucket

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::marker-dev-981f2859/*"
        }
    ]
}
```

## To Do

- client side upload. Note: still need to validate file size/type and generate thumbnail
- Refactor upload route to be less nested if...else. Look at the buried try...catch
