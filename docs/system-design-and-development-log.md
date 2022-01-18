# System design and development log
## Summary
The following document will list some major design and development decisions being made over time, stories involved and rationale behind them.

## Replacement of Date objects with strings for date only values
### Background:
- We're abiding to OAS3.0 spec date-time format as described by [RFC3339 section 5.6](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6). Also, in an attempt to typify and thus keep better control of values the Date type was chosen for date-time storage, however it has demanded and will demand extra work to keep casting back and forth such values with no immediate benefit
- It was recently discovered (due an issue) that Sequelize returns such values as strings, although they're stored like DATEONLY in MySQL
- Client forms (like CMS) manage store every value like string
### Projects involved
- cms
- api
### Risks and countermeasures
- Proper cast and comparision when used in SQL WHERE statements. If required casting to Date will be done just before querying
### Benefits
- No extra conversion needed, possible speed improvement
- Thanks to the date-time format no extra care, or very little, such be taken for sorting or comparision
### Changes required
- Update Datetime models across all projects involved
- Update api schema used by terraform
- Refactor JSON encoding and decoding calls
- Update tests
### Estimated effort and implementation
- 1 point
- To be implemented first to benefit immediately from the results
### Status
- To be implemented during https://app.clubhouse.io/switchcase/story/86405/program-info-testing-fixes
