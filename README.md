# verifyEmail

A web server used to validate email addresses.

The web server will accept a single email address (string) or an array of email addresses (array of strings)

The server will follow the following process:

* Determine if one email or many.
* If one email address:
    * wrap in an array and pretend it's many.
* verify you have at least 1 item in the array.
* Validate each string is an email address
* split the domain from each email address
* sort the array by domain names
* Reduce the array into groups by domain name (with each group containing a maximum of 100 items)
* for each group:
    * resolve domain to MX
    * sort MX records by priority
    * for each mx record
        * verify each email address exists on the recipient server.
        * if error: try the next MX record
* return results to client

Example results sent to client:

```JavaScript
[
  {
    emailAddress: 'john.gruber@gitbit.org',
    statusCode: 200, // Follow http status codes
    message: 'any error message or additional information.'
    // other info may reside here for diagnostic purposes.
  }
]
```
