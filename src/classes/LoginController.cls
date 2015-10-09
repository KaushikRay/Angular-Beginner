public class LoginController {
    public String username {get; set;}
    public String password {get; set;}
    public String selectedOrgType {get; set;}
    public String rawResponse {get; set;}
    public String codeToExecute {get; set;}


    public LoginController() {
        username = '';
        password = '';
        selectedOrgType = 'DEVELOPER';
    }

    public List<SelectOption> getOrgTypes () {
        return new List<SelectOption> {
            new SelectOption('Developer / Production', ''),
            new SelectOption('Developer / Production', '')
        };
    }

    public void authenticateUser() {
        try {

            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://www.salesforce.com/services/Soap/u/22.0');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'text/xml;charset=UTF-8');
            request.setHeader('SOAPAction', '""');

            request.setBody(
                '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body><login xmlns="urn:partner.soap.sforce.com"><username>' + username+ '</username><password>' + password + '</password></login></Body></Envelope>');
            Dom.XmlNode resultElmt = (new Http()).send(request).getBodyDocument().getRootElement()
              .getChildElement('Body', 'http://schemas.xmlsoap.org/soap/envelope/')
              .getChildElement('loginResponse', 'urn:partner.soap.sforce.com')
              .getChildElement('result', 'urn:partner.soap.sforce.com');

            //-------------------------------
            // Grab session id and server url
            //--------------------------------
            final String SERVER_URL = resultElmt.getChildElement('serverUrl', 'urn:partner.soap.sforce.com') .getText().split('/services')[0];
            final String SESSION_ID = resultElmt.getChildElement('sessionId', 'urn:partner.soap.sforce.com') .getText();
            System.debug('SESSION_ID -->' + SESSION_ID);

            HttpRequest req = new HttpRequest();
            req.setHeader('Authorization', 'Bearer ' + SESSION_ID);
            req.setHeader('Content-Type', 'application/json');
            String contentValue = EncodingUtil.urlEncode(codeToExecute, 'UTF-8');
            req.setEndpoint('https://ap1.salesforce.com/services/data/v29.0/tooling/executeAnonymous/?anonymousBody=' + contentValue);
            req.setMethod('GET');

            Http h = new Http();
            HttpResponse res = h.send(req);
            system.debug('res -->' + res.getBody());
            rawResponse = res.getBody();
            } catch (Exception except) {
                System.debug('Logged -->' + except.getMessage());
                rawResponse = except.getMessage();
            }
    }
}