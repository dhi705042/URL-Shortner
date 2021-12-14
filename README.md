# radium
Repository for backend cohort - Radium

10.3.2 301 Moved Permanently

The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. Clients with link editing capabilities ought to automatically re-link references to the Request-URI to one or more of the new references returned by the server, where possible. This response is cacheable unless indicated otherwise.

The new permanent URI SHOULD be given by the Location field in the response. Unless the request method was HEAD, the entity of the
response SHOULD contain a short hypertext note with a hyperlink to
the new URI(s).

If the 301 status code is received in response to a request other
than GET or HEAD, the user agent MUST NOT automatically redirect the
request unless it can be confirmed by the user, since this might
change the conditions under which the request was issued.

10.3.3 302 Found

The requested resource resides temporarily under a different URI.
Since the redirection might be altered on occasion, the client SHOULD continue to use the Request-URI for future requests. This response
is only cacheable if indicated by a Cache-Control or Expires header
field.

The temporary URI SHOULD be given by the Location field in the
response. Unless the request method was HEAD, the entity of the
response SHOULD contain a short hypertext note with a hyperlink to
the new URI(s).

If the 302 status code is received in response to a request other
than GET or HEAD, the user agent MUST NOT automatically redirect the
request unless it can be confirmed by the user, since this might
change the conditions under which the request was issued.

10.3.4 303 See Other

The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource. This method
exists primarily to allow the output of a POST-activated script to
redirect the user agent to a selected resource. The new URI is not a
substitute reference for the originally requested resource. The 303
response MUST NOT be cached, but the response to the second
(redirected) request might be cacheable.

The different URI SHOULD be given by the Location field in the
response. Unless the request method was HEAD, the entity of the
response SHOULD contain a short hypertext note with a hyperlink to
the new URI(s).

10.3.8 307 Temporary Redirect

The requested resource resides temporarily under a different URI.
Since the redirection MAY be altered on occasion, the client SHOULD
continue to use the Request-URI for future requests. This response
is only cacheable if indicated by a Cache-Control or Expires header
field.

The temporary URI SHOULD be given by the Location field in the
response. Unless the request method was HEAD, the entity of the
response SHOULD contain a short hypertext note with a hyperlink to
the new URI(s) , since many pre-HTTP/1.1 user agents do not
understand the 307 status. Therefore, the note SHOULD contain the
information necessary for a user to repeat the original request on
the new URI.

If the 307 status code is received in response to a request other
than GET or HEAD, the user agent MUST NOT automatically redirect the
request unless it can be confirmed by the user, since this might
change the conditions under which the request was issued.