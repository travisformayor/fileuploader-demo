# File Upload Example Notes

A code along with <https://www.youtube.com/watch?v=b6Oe2puTdMQ>

Plus some extras

- Different message types
- File size limit
- Only supported file types
- Rename file to its md5 hash
- Save to s3 (not done yet)

Creating bucket and file in s3 is following this guide:

<https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html>

The JSON convert code for dealing with circular structure in the aws response is from here:

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value>
